import { IconChevronRight } from "@tabler/icons-react";

export default function OrderCompleteHeader() {
  return (
    <>
      <section className="cart-intro order-intro" data-node-id="5:493">
        <div className="cart-breadcrumb">
          <a href="/">Trang chủ</a>
          <IconChevronRight />
          <a href="/gio-hang">Giỏ hàng</a>
          <IconChevronRight />
          <a href="/thanh-toan">Thanh toán</a>
          <IconChevronRight />
          <span>Hoàn tất</span>
        </div>
        <div className="cart-intro-row">
          <div className="cart-heading">
            <div className="cart-signature"><i />8THREADS - "FEEL" THEO TỪNG NHỊP GÕ CỦA BẠN.</div>
            <div className="cart-title-row"><h1>HOÀN TẤT</h1></div>
          </div>
          <div className="cart-steps" aria-label="Tiến trình đặt hàng">
            <span>01&nbsp; GIỎ HÀNG</span>
            <i className="checkout-step-done" />
            <span>02&nbsp; THANH TOÁN</span>
            <i className="checkout-step-done" />
            <span className="current">03&nbsp; HOÀN TẤT</span>
          </div>
        </div>
        <div className="cart-divider" />
      </section>
    </>
  );
}