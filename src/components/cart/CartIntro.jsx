import { IconChevronRight } from "@tabler/icons-react";

export default function CartIntro({ quantity }) {
  return (
    <section className="cart-intro" data-node-id="3:368">
      <div className="cart-breadcrumb" data-node-id="3:369">
        <a href="/">Trang chủ</a>
        <IconChevronRight />
        <span>Giỏ hàng</span>
      </div>
      <div className="cart-intro-row">
        <div className="cart-heading">
          <div className="cart-signature">
            <i />8THREADS - "FEEL" THEO TỪNG NHỊP GÕ CỦA BẠN.
          </div>
          <div className="cart-title-row">
            <h1>GIỎ HÀNG</h1>
            <span>/ {quantity} SẢN PHẨM</span>
          </div>
        </div>
        <div className="cart-steps" aria-label="Tiến trình đặt hàng">
          <span className="current">01&nbsp; GIỎ HÀNG</span>
          <i />
          <span>02&nbsp; THANH TOÁN</span>
          <i />
          <span className="pending">03&nbsp; HOÀN TẤT</span>
        </div>
      </div>
      <div className="cart-divider" />
    </section>
  );
}
