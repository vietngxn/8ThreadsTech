import { useMemo, useState } from "react";
import CartHeader from "../components/cart/CartHeader";
import CartIntro from "../components/cart/CartIntro";
import CartList from "../components/cart/CartList";
import CartSummary from "../components/cart/CartSummary";
import CartFooter from "../components/cart/CartFooter";
import thread75 from "../assets/list-thread-75.png";
import thread65 from "../assets/list-thread-65.png";
import thread98 from "../assets/list-thread-98.png";

const initialItems = [
  { id: "thread-75", name: "THREAD 75", color: "Bạc ánh trăng", switch: "Linear Red Switch", specs: "75%  /  Nhôm CNC  /  3 chế độ", price: 2490000, oldPrice: 2790000, image: thread75 },
  { id: "thread-65", name: "THREAD 65", color: "Đen nguyên bản", switch: "Linear Switch", specs: "65%  /  Hot-swap  /  3 chế độ", price: 1890000, image: thread65 },
  { id: "thread-98", name: "THREAD 98", color: "Trắng sương", switch: "Tactile Brown Switch", specs: "98%  /  Phím số  /  3 chế độ", price: 2190000, oldPrice: 2490000, image: thread98 },
];

export default function CartPage() {
  const [items, setItems] = useState(initialItems.map((item) => ({ ...item, quantity: 1 })));
  
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const oldTotal = useMemo(() => items.reduce((sum, item) => sum + (item.oldPrice ?? item.price) * item.quantity, 0), [items]);
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const savings = oldTotal - subtotal;

  const changeQuantity = (id, change) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item));
  };

  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));

  return (
    <div className="cart-page" data-node-id="3:341">
      <CartHeader quantity={quantity} />
      
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
