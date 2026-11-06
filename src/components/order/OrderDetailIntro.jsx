import { IconChevronRight } from "@tabler/icons-react";

export default function OrderDetailIntro() {
  return (
    <section className="order-detail-intro" data-node-id="15:1254">
      <div className="cart-breadcrumb" data-node-id="15:1255">
        <a href="/">Trang chủ</a>
        <IconChevronRight />
        <a href="/ho-so">Tài khoản</a>
        <IconChevronRight />
        <a href="/don-hang">Đơn hàng của tôi</a>
        <IconChevronRight />
        <span>Chi tiết đơn hàng</span>
      </div>
      <div className="order-detail-title" data-node-id="15:1267">
        <div className="order-detail-signature"><i />8THREADS - "FEEL" THEO TỪNG NHỊP GÕ CỦA BẠN.</div>
        <h1>CHI TIẾT ĐƠN HÀNG</h1>
      </div>
      <div className="order-detail-intro-divider" />
    </section>
  );
}