import { IconTruck, IconCreditCard } from "@tabler/icons-react";

function SectionHeading({ number, children }) {
  return <div className="order-section-heading"><span>{number}</span><h2>{children}</h2></div>;
}

const formatPrice = (price) => `${Number(price || 0).toLocaleString("vi-VN")} ₫`;

export default function OrderShipping({ order }) {
  const fee = Number(order?.shippingFee || 0);

  return (
    <section className="order-shipping">
      <SectionHeading number="03">GIAO HÀNG & THANH TOÁN</SectionHeading>
      <div className="order-method-grid">
        <article>
          <div>
            <IconTruck />
            <strong>{order?.shippingMethodName || "Giao hàng"}</strong>
            <span>{fee === 0 ? "Miễn phí" : formatPrice(fee)}</span>
          </div>
          <p>Mã vận đơn sẽ được cập nhật khi đơn hàng bàn giao cho đơn vị vận chuyển.</p>
        </article>
        <article>
          <div>
            <IconCreditCard />
            <strong>Thanh toán khi nhận hàng (COD)</strong>
          </div>
          <p>Thanh toán {formatPrice(order?.totalAmount)} cho đơn vị vận chuyển khi nhận sản phẩm.</p>
        </article>
      </div>
    </section>
  );
}
