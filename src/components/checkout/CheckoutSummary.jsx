import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;

export default function CheckoutSummary({ items, subtotal, shippingFee, total, coupon, payment, submitted, onCouponChange }) {
  return (
    <aside className="checkout-summary-column">
      <div className="checkout-summary-card">
        <div className="checkout-summary-heading">
          <h2>ĐƠN HÀNG CỦA BẠN</h2>
          <div>
            <span>{items.length} sản phẩm / {items.length} món</span>
            <a href="/gio-hang">Chỉnh sửa</a>
          </div>
        </div>
        
        <div className="checkout-products">
          {items.map((item, index) => (
            <article className="checkout-product" key={item.name} data-node-id={["3:216", "3:228", "3:239"][index]}>
              <div className="checkout-product-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="checkout-product-info">
                <div className="checkout-product-title">
                  <h3>{item.name}</h3>
                  <span>× 1</span>
                </div>
                <p>{item.color}</p>
                <small>{item.switch}</small>
                <div className="checkout-product-price">
                  <strong>{formatPrice(item.price)}</strong>
                  {item.oldPrice && <del>{formatPrice(item.oldPrice)}</del>}
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="checkout-coupon">
          <label htmlFor="checkout-coupon">BẠN CÓ MÃ ƯU ĐÃI?</label>
          <div>
            <input 
              id="checkout-coupon" 
              value={coupon} 
              onChange={(event) => onCouponChange(event.target.value)} 
              placeholder="Nhập mã ưu đãi" 
            />
            <button type="button" disabled={!coupon.trim()} onClick={() => onCouponChange("")}>
              ÁP DỤNG
            </button>
          </div>
        </div>
        
        <div className="checkout-costs">
          <div>
            <span>Tạm tính ({items.length} sản phẩm)</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div>
            <span>Giảm giá</span>
            <strong>0 ₫</strong>
          </div>
          <div>
            <span>Phí vận chuyển</span>
            <strong className={shippingFee === 0 ? "checkout-free" : ""}>
              {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
            </strong>
          </div>
        </div>
        
        <div className="checkout-summary-rule" />
        
        <div className="checkout-grand-total">
          <div>
            <strong>TỔNG CỘNG</strong>
            <b>{formatPrice(total)}</b>
          </div>
          <small>Đã bao gồm VAT</small>
          <p>Bạn đã tiết kiệm 600.000 ₫ từ giá gốc.</p>
        </div>
        
        <div className="checkout-submit-area">
          <label className="checkout-terms">
            <input type="checkbox" name="terms" required />
            <span>
              Tôi đã đọc và đồng ý với <a href="#terms">Điều khoản sử dụng</a> và{" "}
              <a href="#privacy">Chính sách bảo mật</a> của 8ThreadTech.
            </span>
          </label>
          <button className="checkout-submit" type="submit">
            ĐẶT HÀNG <IconArrowRight />
          </button>
          <p className="checkout-payment-hint">
            Thanh toán {formatPrice(total)} {payment === "cod" ? "khi nhận hàng" : "qua phương thức đã chọn"}.
          </p>
          {submitted && (
            <p className="checkout-success" role="status">
              Thông tin đơn hàng đã được kiểm tra. Hệ thống thanh toán chưa được kết nối.
            </p>
          )}
        </div>
      </div>
      
      <div className="checkout-help">
        <span aria-hidden="true">◌</span>
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
