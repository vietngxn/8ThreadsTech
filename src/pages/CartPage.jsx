import { useMemo, useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import CartIntro from "../components/cart/CartIntro";
import CartList from "../components/cart/CartList";
import CartSummary from "../components/cart/CartSummary";
import CartFooter from "../components/cart/CartFooter";
import { cartService } from "../services/cartService";

export default function CartPage() {
  const [items, setItems] = useState(() => cartService.getCart());

  useEffect(() => {
    return cartService.subscribe((updatedItems) => {
      setItems(updatedItems);
    });
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
    [items]
  );
  const oldTotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.oldPrice ?? item.price ?? 0) * (item.quantity || 1), 0),
    [items]
  );
  const quantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const savings = Math.max(0, oldTotal - subtotal);

  const changeQuantity = (id, change) => {
    cartService.changeQuantity(id, change);
  };

  const removeItem = (id) => {
    cartService.removeItem(id);
  };

  return (
    <div className="cart-page" data-node-id="3:341">
      <Navbar quantity={quantity} />
      
      <main>
        <CartIntro quantity={quantity} />
        
        <section className="cart-content" data-node-id="3:390">
          <CartList 
            items={items} 
            savings={savings} 
            onChangeQuantity={changeQuantity} 
            onRemove={removeItem} 
          />
          <CartSummary 
            quantity={quantity} 
            subtotal={subtotal} 
            hasItems={items.length > 0} 
          />
        </section>
      </main>
      
      <CartFooter />
    </div>
  );
}
