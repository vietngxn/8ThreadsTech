import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";

function SectionHeading({ number, children }) {
  return <div className="order-section-heading"><span>{number}</span><h2>{children}</h2></div>;
}

export default function OrderNextSteps() {
  return (
    <section className="order-next-steps">
      <SectionHeading number="01">TIẾP THEO LÀ GÌ?</SectionHeading>
      <div className="order-step-grid">
        <article>
          <span>01 /</span>
          <h3>Xác nhận đơn hàng</h3>
          <p>8Threads sẽ liên hệ để xác nhận thông tin và chuẩn bị sản phẩm.</p>
        </article>
        <article>
          <span>02 /</span>
          <h3>Đóng gói & giao hàng</h3>
          <p>Mã vận đơn sẽ được cập nhật khi đơn hàng bàn giao cho giao vận.</p>
        </article>
        <article>
          <span>03 /</span>
          <h3>Nhận hàng & thanh toán</h3>
          <p>Nhận bộ phím mới và thanh toán khi nhận hàng (COD).</p>
        </article>
      </div>
    </section>
  );
}