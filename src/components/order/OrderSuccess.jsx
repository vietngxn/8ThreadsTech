import { IconArrowRight, IconArrowUpRight, IconCheck } from "@tabler/icons-react";

export default function OrderSuccess({ orderId, statusLabel = "Đã tiếp nhận · Chờ xác nhận" }) {
  return (
    <section className="order-success" data-node-id="5:524">
      <div className="order-success-heading">
        <span className="order-success-icon"><IconCheck aria-hidden="true" /></span>
        <div>
          <h2>ĐẶT HÀNG THÀNH CÔNG!</h2>
          <p>Cảm ơn bạn đã chọn 8ThreadTech. Nhịp gõ mới đang đến gần.</p>
        </div>
      </div>
      <div className="order-id-panel">
        <div>
          <span>MÃ ĐƠN HÀNG</span>
          <strong>{orderId}</strong>
        </div>
        <span className="order-status">{statusLabel}</span>
      </div>
      <p className="order-payment-copy">
        Đơn hàng đã được ghi nhận, chưa thanh toán. Bạn sẽ thanh toán khi nhận hàng (COD).
        8Threads sẽ liên hệ qua số điện thoại bạn đã cung cấp để xác nhận đơn.
      </p>
      <div className="order-actions">
        <a className="order-primary-action" href="/ban-phim">
          <span>TIẾP TỤC MUA SẮM</span>
          <IconArrowRight />
        </a>
        <a className="order-secondary-action" href="/don-hang">
          <span>XEM ĐƠN HÀNG</span>
          <IconArrowUpRight />
        </a>
      </div>
    </section>
  );
}