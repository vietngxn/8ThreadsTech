import { useState } from "react";
import CartHeader from "../components/cart/CartHeader";
import CartFooter from "../components/cart/CartFooter";
import OrderDetailIntro from "../components/order/OrderDetailIntro";
import OrderDetailMain from "../components/order/OrderDetailMain";
import AccountSidebar from "../components/order/AccountSidebar";

export default function OrderDetailPage() {
  const [cancelled, setCancelled] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const onCancelToggle = (value) => {
    if (value === false) setConfirmCancel(false);
    else setCancelled(value);
  };

  const onConfirmCancel = (value) => {
    setCancelled(value);
    setConfirmCancel(false);
  };

  return (
    <div className="order-detail-page" data-node-id="15:1238">
      <CartHeader quantity={0} />
      
      <main>
        <OrderDetailIntro />
        
        <section className="order-detail-layout" data-node-id="15:1273">
          <AccountSidebar />
          <OrderDetailMain
            cancelled={cancelled}
            onCancelToggle={onCancelToggle}
            onConfirmCancel={onConfirmCancel}
          />
        </section>
      </main>
      
      <CartFooter />
    </div>
  );
}