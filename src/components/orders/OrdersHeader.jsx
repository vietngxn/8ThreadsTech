import { IconChevronRight } from "@tabler/icons-react";

export default function OrdersHeader() {
  return (
    <section className="orders-intro" data-node-id="12:760">
      <div className="cart-breadcrumb" data-node-id="12:761">
        <a href="/">Trang chủ</a>
        <IconChevronRight aria-hidden="true" />
        <a href="/ho-so">Tài khoản</a>
        <IconChevronRight aria-hidden="true" />
        <span>Đơn hàng của tôi</span>
      </div>
      <div className="orders-title" data-node-id="12:765">
        <div className="orders-signature" data-node-id="12:766">
          <i aria-hidden="true" />
          8THREADS - "FEEL" NHỊP GÕ CỦA BẠN.
        </div>
        <h1 data-node-id="12:768">ĐƠN HÀNG CỦA TÔI</h1>
      </div>
      <div className="orders-intro-divider" />
    </section>
  );
}
