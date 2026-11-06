import { useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import CartHeader from "../components/cart/CartHeader";
import CartFooter from "../components/cart/CartFooter";
import CheckoutIntro from "../components/checkout/CheckoutIntro";
import CheckoutForm from "../components/checkout/CheckoutForm";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import thread75 from "../assets/list-thread-75.png";
import thread65 from "../assets/list-thread-65.png";
import thread98 from "../assets/list-thread-98.png";

const items = [
  { name: "THREAD 75", color: "Bạc ánh trăng", switch: "Linear Red Switch", price: 2490000, oldPrice: 2790000, image: thread75 },
  { name: "THREAD 65", color: "Đen nguyên bản", switch: "Linear Switch", price: 1890000, image: thread65 },
  { name: "THREAD 98", color: "Trắng sương", switch: "Tactile Brown Switch", price: 2190000, oldPrice: 2490000, image: thread98 },
];

export default function CheckoutPage() {
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shippingFee = shipping === "express" ? 35000 : 0;
  const total = subtotal + shippingFee;

  const submitOrder = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="checkout-page" data-node-id="3:58">
      <CartHeader quantity={3} />
      
      <main>
        <CheckoutIntro />
        
        <form id="checkout-form" className="checkout-content" onSubmit={submitOrder}>
          <CheckoutForm 
            shipping={shipping}
            payment={payment}
            onShippingChange={setShipping}
            onPaymentChange={setPayment}
          />
          
          <CheckoutSummary
            items={items}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={total}
            coupon={coupon}
            payment={payment}
            submitted={submitted}
            onCouponChange={setCoupon}
          />
        </form>
      </main>
      
      <CartFooter />
    </div>
  );
}
