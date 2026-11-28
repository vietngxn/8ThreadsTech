import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";

import { describeCoupon } from "../../utils/couponText";

const formatPrice = (price) => `${(price || 0).toLocaleString("vi-VN")} ₫`;

export default function CheckoutSummary({
  items = [],
  subtotal,
  shippingFee,
  total,
  coupon,
  appliedCoupon = null,
  couponMessage = "",
  couponLoading = false,
  discount = 0,
  onApplyCoupon = () => { },
  onRemoveCoupon = () => { },
  payment,
  submitting = false,
  canSubmit = true,
  errorMessage = "",
  onCouponChange,
}) {
  const totalQuantity = items.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const oldTotal = items.reduce(
    (sum, item) =>
      sum + (item.oldPrice ?? item.price ?? 0) * (item.quantity || 1),
    0
  );

  const savings = Math.max(0, oldTotal - subtotal);

  return (
    <aside className="checkout-summary-column">
      <div className="checkout-summary-card">
        <div className="checkout-summary-heading">
          <h2>ĐƠN HÀNG CỦA BẠN</h2>
          <div>
            <span>
              {items.length} sản phẩm / {totalQuantity} món
            </span>
            <a href="/gio-hang">Chỉnh sửa</a>
          </div>
        </div>

        <div className="checkout-products">
          {items.map((item, index) => {
            const qty = item.quantity || 1;
            return (
              <article
                className="checkout-product"
                key={item.cartItemId || `${item.name}-${index}`}
                data-node-id={["3:216", "3:228", "3:239"][index]}
              >
                <div className="checkout-product-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="checkout-product-info">
                  <div className="checkout-product-title">
                    <h3>{item.name}</h3>
                    <span>× {qty}</span>
                  </div>
                  <p>{item.color}</p>
                  <small>{item.switch}</small>
                  <div className="checkout-product-price">
                    <strong>{formatPrice((item.price || 0) * qty)}</strong>
                    {item.oldPrice && (
                      <del>{formatPrice(item.oldPrice * qty)}</del>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="checkout-coupon">
          <label htmlFor="checkout-coupon">BẠN CÓ MÃ ƯU ĐÃI?</label>
          {appliedCoupon ? (
            <div>
              <input id="checkout-coupon" value={appliedCoupon.code} readOnly />
              <button type="button" onClick={onRemoveCoupon} disabled={submitting}>
                BỎ MÃ
              </button>
            </div>
          ) : (
            <div>
              <input
                id="checkout-coupon"
                value={coupon}
                onChange={(event) => onCouponChange(event.target.value.toUpperCase())}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onApplyCoupon();
                  }
                }}
                placeholder="Nhập mã khuyến mãi"
                maxLength={50}
              />
              <button
                type="button"
                disabled={couponLoading || !coupon.trim()}
                onClick={onApplyCoupon}
              >
                {couponLoading ? "ĐANG KIỂM TRA..." : "ÁP DỤNG"}
              </button>
            </div>
          )}
          {appliedCoupon && (
            <small className="checkout-coupon-ok">
              {appliedCoupon.name} · {describeCoupon(appliedCoupon)}
              <br />Bạn được giảm {formatPrice(Number(appliedCoupon.discountAmount))}
            </small>
          )}
          {!appliedCoupon && couponMessage && (
            <small className="checkout-coupon-error" role="alert">{couponMessage}</small>
          )}
        </div>

        <div className="checkout-costs">
          <div>
            <span>Tạm tính ({totalQuantity} sản phẩm)</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div>
            <span>Giảm giá{appliedCoupon ? ` (${appliedCoupon.code})` : ""}</span>
            <strong className={discount > 0 ? "checkout-discount" : ""}>
              {discount > 0 ? `− ${formatPrice(discount)}` : "0 ₫"}
            </strong>
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
          {savings > 0 && (
            <p>Bạn đã tiết kiệm {formatPrice(savings)} từ giá gốc.</p>
          )}
        </div>

        <div className="checkout-submit-area">
          <label className="checkout-terms">
            <input type="checkbox" name="terms" required />
            <span>
              Tôi đã đọc và đồng ý với <a href="#terms">Điều khoản sử dụng</a>{" "}
              và <a href="#privacy">Chính sách bảo mật</a> của 8ThreadTech.
            </span>
          </label>
          <button
            className="checkout-submit"
            type="submit"
            disabled={submitting || !canSubmit}
            aria-busy={submitting}
          >
            {submitting ? "ĐANG XỬ LÝ..." : payment === "COD" ? "ĐẶT HÀNG" : "ĐẶT HÀNG VÀ THANH TOÁN"}{" "}<IconArrowRight />
          </button>
          <p className="checkout-payment-hint">
            Thanh toán {formatPrice(total)}{" "}
            {payment === "COD" ? "khi nhận hàng" : `qua ${payment}`}.
          </p>
          {errorMessage && (
            <p
              className="checkout-error"
              role="alert"
              style={{ color: "#ef4444", marginTop: 12 }}
            >
              {errorMessage}
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