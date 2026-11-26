import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import CartIntro from "../components/cart/CartIntro";
import CartList from "../components/cart/CartList";
import CartSummary from "../components/cart/CartSummary";
import CartFooter from "../components/cart/CartFooter";

import { useCart } from "../hooks/useCart";

const SELECTED_CART_STORAGE_KEY = "selected_cart_item_ids";

const readStoredSelectedIds = () => {
  try {
    const raw = sessionStorage.getItem(SELECTED_CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    loading,
    updateQuantity,
    removeItem,
  } = useCart();

  const location = useLocation();

  const [selectedCartItemIds, setSelectedCartItemIds] = useState(() => {
    // Ưu tiên ID truyền ngược từ trang thanh toán (nếu có), sau đó tới sessionStorage
    if (Array.isArray(location.state?.cartItemIds)) {
      return location.state.cartItemIds;
    }
    return readStoredSelectedIds() ?? [];
  });

  // Lưu mỗi khi danh sách chọn thay đổi
  useEffect(() => {
    try {
      sessionStorage.setItem(
        SELECTED_CART_STORAGE_KEY,
        JSON.stringify(selectedCartItemIds)
      );
    } catch {
      // Bỏ qua nếu sessionStorage không khả dụng
    }
  }, [selectedCartItemIds]);

  // Nếu cartItems load xong hoặc thay đổi, loại bỏ các ID không còn tồn tại trong giỏ
  useEffect(() => {
    if (loading) return;
    const validIds = new Set(cartItems.map((item) => item.cartItemId));
    setSelectedCartItemIds((prev) => prev.filter((id) => validIds.has(id)));
  }, [cartItems, loading]);

  const toggleItem = (cartItemId) => {
    setSelectedCartItemIds((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const selectedItems = useMemo(
    () =>
      cartItems.filter((item) =>
        selectedCartItemIds.includes(item.cartItemId)
      ),
    [cartItems, selectedCartItemIds]
  );

  const selectedQuantity = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      ),
    [selectedItems]
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      ),
    [selectedItems]
  );

  const oldTotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) =>
          sum + (item.oldPrice ?? item.price ?? 0) * (item.quantity || 1),
        0
      ),
    [selectedItems]
  );

  const savings = Math.max(0, oldTotal - subtotal);

  const changeQuantity = (id, change) => {
    const item = cartItems.find((item) => item.cartItemId === id);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) return;

    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id) => {
    removeItem(id);
    setSelectedCartItemIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  return (
    <div className="cart-page" data-node-id="3:341">
      <Navbar quantity={cartCount} />

      <main>
        <CartIntro quantity={cartCount} />

        <section className="cart-content" data-node-id="3:390">
          {loading ? (
            <p>Đang tải giỏ hàng...</p>
          ) : (
            <>
              <CartList
                items={cartItems}
                savings={savings}
                selectedCartItemIds={selectedCartItemIds}
                onToggleItem={toggleItem}
                onChangeQuantity={changeQuantity}
                onRemove={handleRemoveItem}
              />

              <CartSummary
                quantity={selectedQuantity}
                subtotal={subtotal}
                hasItems={selectedItems.length > 0}
                selectedCartItemIds={selectedCartItemIds}
              />
            </>
          )}
        </section>
      </main>

      <CartFooter />
    </div>
  );
}