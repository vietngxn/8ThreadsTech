import { IconArrowRight } from "@tabler/icons-react";

function SectionHeading({ number, children }) {
  return <div className="order-section-heading"><span>{number}</span><h2>{children}</h2></div>;
}

export default function OrderDelivery() {
  return (
    <section className="order-delivery">
      <SectionHeading number="02">THÔNG TIN NHẬN HÀNG</SectionHeading>
      <div className="order-delivery-details">
        <div>
          <span>THÔNG TIN ĐẶT HÀNG</span>
          <strong>Nguyễn Minh An</strong>
          <p>0987 654 123</p>
          <p>minhan@example.com</p>
        </div>
        <div>
          <strong>Địa chỉ giao hàng</strong>
          <p>123 Đường Số 8, Phường Thủ Đức, TP. Hồ Chí Minh</p>
        </div>
      </div>
    </section>
  );
}