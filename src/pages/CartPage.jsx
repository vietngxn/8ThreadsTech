import { useState, useMemo } from "react";

import Navbar from "../components/common/Navbar";
import CartIntro from "../components/cart/CartIntro";
import CartList from "../components/cart/CartList";
import CartSummary from "../components/cart/CartSummary";
import CartFooter from "../components/cart/CartFooter";

import { useCart } from "../hooks/useCart";

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    loading,
    updateQuantity,
    removeItem,
  } = useCart();

  const [selectedCartItemIds, setSelectedCartItemIds] = useState([]);

  const toggleItem = (cartItemId) => {
    setSelectedCartItemIds((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  // Chỉ lấy các sản phẩm đang được tick chọn
  const selectedItems = useMemo(
    () =>
      cartItems.filter((item) =>
        selectedCartItemIds.includes(item.cartItemId)
      ),
    [cartItems, selectedCartItemIds]
  );

  // Tổng số lượng của các sản phẩm đã chọn (dùng cho CartSummary)
  const selectedQuantity = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      ),
    [selectedItems]
  );

  // Tạm tính chỉ tính trên sản phẩm đã chọn
  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      ),
    [selectedItems]
  );

  // Giá gốc chỉ tính trên sản phẩm đã chọn
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

    if (newQuantity <= 0) {
      return;
    }

    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id) => {
    removeItem(id);
    setSelectedCartItemIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  return (
    <div className="cart-page" data-node-id="3:341">
      {/* Navbar & CartIntro vẫn giữ tổng giỏ hàng như cũ */}
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
                selectedItems={selectedItems}
              />
            </>
          )}
        </section>
      </main>

      <CartFooter />
    </div>
  );
}