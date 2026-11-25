import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import Navbar from "../components/common/Navbar";
import CartFooter from "../components/cart/CartFooter";
import CheckoutIntro from "../components/checkout/CheckoutIntro";
import CheckoutForm from "../components/checkout/CheckoutForm";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import { cartService } from "../services/cartService";

export default function CheckoutPage() {
  const [items, setItems] = useState(() => cartService.getCart());
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    return cartService.subscribe((updated) => {
      setItems(updated);
    });
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const shippingFee = shipping === "express" ? 35000 : 0;
  const total = subtotal + shippingFee;

  const submitOrder = (event) => {
    event.preventDefault();
    setSubmitted(true);
    cartService.clearCart();
    setTimeout(() => {
      navigate("/hoan-tat");
    }, 400);
  };

  return (
    <div className="checkout-page" data-node-id="3:58">
      <Navbar quantity={totalQuantity} />
      
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
