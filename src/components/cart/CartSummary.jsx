import { useEffect, useState } from "react";
import { orderService, getOrderErrorMessage } from "../../services/orderService";
import { useNavigate } from "react-router-dom";
import {
  IconArrowRight,
  IconLock,
  IconHeadphones,
  IconArrowUpRight,
} from "@tabler/icons-react";

import { describeCoupon } from "../../utils/couponText";

const formatPrice = (price) =>
  `${(price || 0).toLocaleString("vi-VN")} ₫`;

export default function CartSummary({
  quantity,
  subtotal,
  hasItems,
  selectedCartItemIds = [],
}) {
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  // Chọn/bỏ chọn sản phẩm làm đổi tạm tính: số tiền giảm cũ không còn đúng
  useEffect(() => {
    setAppliedCoupon(null);
  }, [subtotal]);

  const discount = Math.min(Number(appliedCoupon?.discountAmount || 0), subtotal || 0);

  const applyCoupon = async (event) => {
    event.preventDefault();
    const code = coupon.trim();
    if (!code || couponLoading) return;

    if (!hasItems) {
      setCouponMessage("Vui lòng chọn sản phẩm trước khi áp dụng mã");
      return;
    }

    setCouponLoading(true);
    setCouponMessage("");
    try {
      setAppliedCoupon(await orderService.previewCoupon(code, subtotal));
    } catch (error) {
      setAppliedCoupon(null);
      setCouponMessage(getOrderErrorMessage(error));
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
    setCouponMessage("");
  };

  const handleCheckout = () => {
    if (selectedCartItemIds.length === 0) {
      return;
    }

    navigate("/thanh-toan", {
      state: {
        cartItemIds: selectedCartItemIds,
        couponCode: appliedCoupon?.code, // trang thanh toán tự áp lại mã này
      },
    });
  };

  return (
    <aside className="cart-summary" data-node-id="3:473">
      <div className="cart-summary-card" data-node-id="3:474">
        <h2>TÓM TẮT ĐƠN HÀNG</h2>
        <div className="cart-summary-rule" />

        <form className="cart-coupon" onSubmit={applyCoupon}>
          <label htmlFor="coupon-code">BẠN CÓ MÃ ƯU ĐÃI?</label>
          <div>
            <input
              id="coupon-code"
              value={appliedCoupon ? appliedCoupon.code : coupon}
              onChange={(event) => setCoupon(event.target.value.toUpperCase())}
              placeholder="Nhập mã ưu đãi"
              maxLength={50}
              readOnly={!!appliedCoupon}
            />
            {appliedCoupon ? (
              <button type="button" onClick={removeCoupon}>BỎ MÃ</button>
            ) : (
              <button type="submit" disabled={!coupon.trim() || couponLoading}>
                {couponLoading ? "ĐANG KIỂM TRA..." : "ÁP DỤNG"}
              </button>
            )}
          </div>
          {appliedCoupon && (
            <small className="cart-coupon-ok">
              {appliedCoupon.name} · {describeCoupon(appliedCoupon)}
              <br />Bạn được giảm {formatPrice(discount)}
            </small>
          )}
          {!appliedCoupon && couponMessage && (
            <small className="cart-coupon-error" role="alert">{couponMessage}</small>
          )}
        </form>

        <div className="cart-costs">
          <div>
            <span>Tạm tính ({quantity} sản phẩm)</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div>
            <span>Giảm giá</span>
            <strong className={discount > 0 ? "cart-discount" : ""}>
              {discount > 0 ? `− ${formatPrice(discount)}` : "0 ₫"}
            </strong>
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
            <b>{formatPrice((subtotal || 0) - discount)}</b>
          </div>
          <small>Đã bao gồm VAT</small>
        </div>

        <button
          type="button"
          className={`cart-checkout${hasItems ? "" : " is-disabled"}`}
          disabled={!hasItems}
          onClick={handleCheckout}
        >
          TIẾN HÀNH THANH TOÁN <IconArrowRight />
        </button>

        <div className="cart-secure">
          <IconLock />
          Thông tin thanh toán được bảo mật
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