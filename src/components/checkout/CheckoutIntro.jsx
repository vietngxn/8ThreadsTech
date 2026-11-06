import { IconChevronRight } from "@tabler/icons-react";

export default function CheckoutIntro() {
  return (
    <section className="cart-intro checkout-intro">
      <div className="cart-breadcrumb" data-node-id="3:86">
        <a href="/">Trang chủ</a>
        <IconChevronRight />
        <a href="/gio-hang">Giỏ hàng</a>
        <IconChevronRight />
        <span>Thanh toán</span>
      </div>
      <div className="cart-intro-row">
        <div className="cart-heading">
          <div className="cart-signature">
            <i />8THREADS - "FEEL" THEO TỪNG NHỊP GÕ CỦA BẠN.
          </div>
          <div className="cart-title-row">
            <h1>THANH TOÁN</h1>
          </div>
        </div>
        <div className="cart-steps" aria-label="Tiến trình đặt hàng">
          <span>01&nbsp; GIỎ HÀNG</span>
          <i className="checkout-step-done" />
          <span className="current">02&nbsp; THANH TOÁN</span>
          <i />
          <span className="pending">03&nbsp; HOÀN TẤT</span>
        </div>
      </div>
      <div className="cart-divider" />
    </section>
  );
}
