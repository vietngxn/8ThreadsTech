import { IconCheck } from "@tabler/icons-react";

export default function OrderSuccess({ orderId, total }) {
  const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;
  
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
        <span className="order-status">Đã tiếp nhận · Chờ xác nhận</span>
      </div>
      <p className="order-payment-copy">
        Đơn hàng đã được ghi nhận, chưa thanh toán. Bạn sẽ thanh toán khi nhận hàng (COD). 
        Thông tin xác nhận sẽ được gửi qua email sau khi đơn được xử lý.
      </p>
      <div className="order-actions">
        <a className="order-primary-action" href="/">
          <span>TIẾP TỤC MUA SẮM</span>
          <IconArrowRight />
        </a>
        <a className="order-secondary-action" href="#don-hang">
          <span>XEM ĐƠN HÀNG</span>
          <IconArrowUpRight />
        </a>
      </div>
    </section>
  );
}