import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { cartService } from "../services/cartService";
import { authService } from "../services/authService";

const CartContext = createContext(null);

const SYNC_DELAY_MS = 400; // ngừng bấm 400ms mới gửi lên server
const MAX_QUANTITY = 99;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartError, setCartError] = useState("");

  // Bản sao luôn mới nhất của giỏ hàng. Nhiều lần bấm liên tiếp đều đọc số lượng từ đây,
  // không phụ thuộc vào lần render trước.
  const itemsRef = useRef([]);

  // cartItemId -> { timer, inFlight, confirmed }
  //   confirmed: số lượng server đã xác nhận gần nhất (dùng để hoàn lại khi lỗi)
  const syncRef = useRef(new Map());

  const commit = useCallback((next) => {
    itemsRef.current = next;
    setCartItems(next);
  }, []);

  const patchItem = useCallback(
    (cartItemId, patch) => {
      commit(
        itemsRef.current.map((item) =>
          item.cartItemId === cartItemId ? { ...item, ...patch } : item
        )
      );
    },
    [commit]
  );

  const cartCount = cartService.getTotalQuantity(cartItems);

  // Lấy giỏ hàng từ Backend
  const loadCart = useCallback(async () => {
    if (!authService.getToken()) {
      commit([]);
      return;
    }

    setLoading(true);

    try {
      const items = await cartService.getCart();

      // Dòng đang có thay đổi chưa gửi/chưa được xác nhận thì giữ số lượng trên màn hình
      commit(
        items.map((item) => {
          if (!syncRef.current.has(item.cartItemId)) return item;

          const local = itemsRef.current.find(
            (current) => current.cartItemId === item.cartItemId
          );

          return local ? { ...item, quantity: local.quantity } : item;
        })
      );
    } catch (error) {
      console.error("Không thể tải giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  }, [commit]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Gửi số lượng hiện tại của một dòng lên server (mỗi dòng chỉ có tối đa một request đang chạy)
  const flush = useCallback(
    async (cartItemId) => {
      const entry = syncRef.current.get(cartItemId);
      if (!entry) return;

      clearTimeout(entry.timer);
      entry.timer = null;

      // Đang gửi: khi xong sẽ tự gửi tiếp số lượng mới nhất
      if (entry.inFlight) return;

      const item = itemsRef.current.find(
        (current) => current.cartItemId === cartItemId
      );

      if (!item) {
        syncRef.current.delete(cartItemId);
        return;
      }

      const sent = item.quantity;

      // Bấm tăng rồi giảm về đúng số cũ: không cần gọi API
      if (sent === entry.confirmed) {
        syncRef.current.delete(cartItemId);
        return;
      }

      entry.inFlight = true;

      try {
        const updated = await cartService.updateQuantity(cartItemId, sent);

        entry.inFlight = false;
        entry.confirmed = sent;

        const latest = itemsRef.current.find(
          (current) => current.cartItemId === cartItemId
        );

        if (!latest) {
          // Dòng đã bị xóa trong lúc chờ
          syncRef.current.delete(cartItemId);
        } else if (latest.quantity === sent) {
          // Không bấm thêm: nhận dữ liệu mới nhất từ server (giá, tồn kho...)
          patchItem(cartItemId, { ...updated, quantity: sent });
          syncRef.current.delete(cartItemId);
        } else {
          // Đã bấm thêm trong lúc chờ: giữ số trên màn hình và gửi tiếp
          flush(cartItemId);
        }
      } catch (error) {
        clearTimeout(entry.timer);
        syncRef.current.delete(cartItemId);

        // Hoàn lại số lượng server đã xác nhận và báo lỗi (ví dụ vượt tồn kho)
        patchItem(cartItemId, { quantity: entry.confirmed });
        setCartError(error.message || "Không thể cập nhật số lượng");
      }
    },
    [patchItem]
  );

  // Đặt số lượng một dòng: hiển thị NGAY, gửi lên server sau khi ngừng bấm
  const updateQuantity = useCallback(
    (cartItemId, quantity) => {
      const item = itemsRef.current.find(
        (current) => current.cartItemId === cartItemId
      );

      if (!item) return;

      const next = Math.min(
        MAX_QUANTITY,
        Math.max(1, Math.trunc(Number(quantity)) || 1)
      );

      if (next === item.quantity) return;

      let entry = syncRef.current.get(cartItemId);

      if (!entry) {
        entry = { timer: null, inFlight: false, confirmed: item.quantity };
        syncRef.current.set(cartItemId, entry);
      }

      patchItem(cartItemId, { quantity: next });

      clearTimeout(entry.timer);
      entry.timer = setTimeout(() => flush(cartItemId), SYNC_DELAY_MS);
    },
    [flush, patchItem]
  );

  // Tăng/giảm theo số lượng MỚI NHẤT trên màn hình (nên dùng cho nút + / -)
  const changeQuantity = useCallback(
    (cartItemId, delta) => {
      const item = itemsRef.current.find(
        (current) => current.cartItemId === cartItemId
      );

      if (item) updateQuantity(cartItemId, item.quantity + delta);
    },
    [updateQuantity]
  );

  // Xóa sản phẩm: biến mất ngay, hoàn lại bằng cách tải lại giỏ nếu server báo lỗi
  const removeItem = useCallback(
    async (cartItemId) => {
      const entry = syncRef.current.get(cartItemId);

      if (entry) {
        clearTimeout(entry.timer);
        syncRef.current.delete(cartItemId);
      }

      commit(
        itemsRef.current.filter((item) => item.cartItemId !== cartItemId)
      );

      try {
        await cartService.removeItem(cartItemId);
      } catch (error) {
        setCartError(error.message || "Không thể xóa sản phẩm");
        await loadCart();
      }
    },
    [commit, loadCart]
  );

  // Thêm sản phẩm
  const addToCart = async (productVariantId, quantity = 1) => {
    await cartService.addToCart(productVariantId, quantity);
    await loadCart();
  };

  const refreshCart = () => loadCart();
  const clearCartError = () => setCartError("");

  // Rời khỏi trang giỏ hàng khi còn thay đổi chưa gửi: gửi ngay, không bỏ sót
  useEffect(() => {
    const pending = syncRef.current;

    return () => {
      pending.forEach((_, cartItemId) => flush(cartItemId));
    };
  }, [flush]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        cartError,
        clearCartError,
        loadCart,
        refreshCart,
        addToCart,
        updateQuantity,
        changeQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart phải được sử dụng bên trong CartProvider"
    );
  }

  return context;
}