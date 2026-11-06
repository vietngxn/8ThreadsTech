import { IconArrowRight, IconArrowUpRight, IconCheck, IconChevronRight, IconTruck, IconCreditCard, IconHeadphones, IconSearch, IconShoppingBag, IconUser } from "@tabler/icons-react";
import CartHeader from "../components/cart/CartHeader";
import CartFooter from "../components/cart/CartFooter";
import OrderCompleteHeader from "../components/order/OrderCompleteHeader";
import OrderSuccess from "../components/order/OrderSuccess";
import OrderNextSteps from "../components/order/OrderNextSteps";
import OrderDelivery from "../components/order/OrderDelivery";
import OrderShipping from "../components/order/OrderShipping";
import OrderSummary from "../components/order/OrderSummary";
import thread75 from "../assets/list-thread-75.png";
import thread65 from "../assets/list-thread-65.png";
import thread98 from "../assets/list-thread-98.png";

const items = [
  { name: "THREAD 75", color: "Bạc ánh trăng", switch: "Linear Red Switch", price: 2490000, oldPrice: 2790000, image: thread75 },
  { name: "THREAD 65", color: "Đen nguyên bản", switch: "Linear Switch", price: 1890000, image: thread65 },
  { name: "THREAD 98", color: "Trắng sương", switch: "Tactile Brown Switch", price: 2190000, oldPrice: 2490000, image: thread98 },
];

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;
const total = items.reduce((sum, item) => sum + item.price, 0);
const saved = items.reduce((sum, item) => sum + (item.oldPrice ?? item.price) - item.price, 0);

export default function OrderCompletePage() {
  return (
    <div className="order-complete-page" data-node-id="5:465">
      <CartHeader quantity={3} />
      
      <main className="order-complete-content" data-node-id="5:522">
        <OrderCompleteHeader />
        
        <div className="order-confirmation-column">
          <OrderSuccess orderId="#8TT-261027-0186" total={total} />
          <OrderNextSteps />
          <OrderDelivery />
          <OrderShipping total={total} />
          <OrderSummary 
            items={items} 
            total={total} 
            saved={saved} 
          />
        </div>
      </main>
      
      <CartFooter />
    </div>
  );
}