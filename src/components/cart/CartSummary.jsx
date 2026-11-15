import { useState } from "react";
import { IconArrowRight, IconLock, IconHeadphones, IconArrowUpRight } from "@tabler/icons-react";

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;

export default function CartSummary({ quantity, subtotal, hasItems }) {
  const [coupon, setCoupon] = useState("");

  return (
    <aside className="cart-summary" data-node-id="3:473">
      <div className="cart-summary-card" data-node-id="3:474">
        <h2>TÓM TẮT ĐƠN HÀNG</h2>
        <div className="cart-summary-rule" />
        
        <form className="cart-coupon" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="coupon-code">BẠN CÓ MÃ ƯU ĐÃI?</label>
          <div>
            <input 
              id="coupon-code" 
              value={coupon} 
              onChange={(event) => setCoupon(event.target.value)} 
              placeholder="Nhập mã ưu đãi" 
            />
            <button type="submit" disabled={!coupon.trim()}>
              ÁP DỤNG
            </button>
          </div>
        </form>
        
        <div className="cart-costs">
          <div>
            <span>Tạm tính ({quantity} sản phẩm)</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div>
            <span>Giảm giá</span>
            <strong>0 ₫</strong>
          </div>
          <div>
            <span>Phí vận chuyển</span>
            <strong className="free-shipping">Miễn phí</strong>
          </div>
        </div>
        
        <div className="cart-summary-rule" />
        
        <div className="cart-grand-total">
          <div>
            <strong>TỔNG CỘNG</strong>
            <b>{formatPrice(subtotal)}</b>
          </div>
          <small>Đã bao gồm VAT</small>
        </div>
        
        <a 
          className={`cart-checkout${hasItems ? "" : " is-disabled"}`} 
          aria-disabled={!hasItems} 
          href={hasItems ? "/thanh-toan" : undefined}
        >
          TIẾN HÀNH THANH TOÁN <IconArrowRight />
        </a>
        
        <div className="cart-secure">
          <IconLock />Thông tin thanh toán được bảo mật
        </div>
      </div>
      
      <div className="cart-help">
        <IconHeadphones />
        <div>
          <span>Cần hỗ trợ trước khi đặt hàng?</span>
          <a href="mailto:hello@8threadtech.vn">
            NHẮN TIN CHO 8THREADS <IconArrowUpRight />
          </a>
        </div>
      </div>
    </aside>
  );
}
