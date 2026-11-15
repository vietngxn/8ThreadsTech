import { IconTruck, IconCreditCard } from "@tabler/icons-react";

function SectionHeading({ number, children }) {
  return <div className="order-section-heading"><span>{number}</span><h2>{children}</h2></div>;
}

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;

export default function OrderShipping({ total }) {
  return (
    <section className="order-shipping">
      <SectionHeading number="03">GIAO HÀNG & THANH TOÁN</SectionHeading>
      <div className="order-method-grid">
        <article>
          <div>
            <IconTruck />
            <strong>Giao hàng tiêu chuẩn</strong>
            <span>Miễn phí</span>
          </div>
          <p>Dự kiến 2–5 ngày làm việc kể từ khi xác nhận đơn hàng.</p>
        </article>
        <article>
          <div>
            <IconCreditCard />
            <strong>Thanh toán khi nhận hàng (COD)</strong>
          </div>
          <p>Thanh toán {formatPrice(total)} cho đơn vị vận chuyển khi nhận sản phẩm.</p>
        </article>
      </div>
    </section>
  );
}