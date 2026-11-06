import { useState } from "react";
import Navbar from "../components/common/Navbar";
import CartFooter from "../components/cart/CartFooter";
import OrderDetailIntro from "../components/order/OrderDetailIntro";
import OrderDetailMain from "../components/order/OrderDetailMain";

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
      <Navbar quantity={0} />
      
      <main>
        <OrderDetailIntro />
        <OrderDetailMain
          cancelled={cancelled}
          onCancelToggle={onCancelToggle}
          onConfirmCancel={onConfirmCancel}
        />
      </main>
      
      <CartFooter />
    </div>
  );
}