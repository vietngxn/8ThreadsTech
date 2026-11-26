import { IconArrowUpRight, IconHeadphones } from "@tabler/icons-react";

const formatPrice = (price) => `${Number(price || 0).toLocaleString("vi-VN")} ₫`;

export default function OrderSummary({
  items = [],
  subtotal = 0,
  discount = 0,
  shippingFee = 0,
  total = 0,
}) {
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <aside className="order-summary-column">
      <div className="order-summary-card" id="don-hang" data-node-id="5:600">
        <header className="order-summary-heading">
          <h2>ĐƠN HÀNG CỦA BẠN</h2>
          <span>{items.length} sản phẩm / {totalQuantity} món</span>
        </header>
        <div className="order-products">
          {items.map((item) => (
            <article className="order-product" key={item.key}>
              <div className="order-product-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="order-product-info">
                <div className="order-product-title">
                  <h3>{item.name}</h3>
                  <span>× {item.quantity}</span>
                </div>
                {item.options && <p>{item.options}</p>}
                <div className="order-product-price">
                  <strong>{formatPrice(item.lineTotal)}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="order-costs">
          <div>
            <span>Tạm tính ({totalQuantity} sản phẩm)</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div>
            <span>Giảm giá</span>
            <strong>{formatPrice(discount)}</strong>
          </div>
          <div>
            <span>Phí vận chuyển</span>
            <strong className={Number(shippingFee) === 0 ? "order-free" : ""}>
              {Number(shippingFee) === 0 ? "Miễn phí" : formatPrice(shippingFee)}
            </strong>
          </div>
        </div>
        <div className="order-summary-rule" />
        <div className="order-grand-total">
          <div>
            <strong>TỔNG CỘNG</strong>
            <b>{formatPrice(total)}</b>
          </div>
          <small>Đã bao gồm VAT</small>
        </div>
        <div className="order-payment-note">
          <strong>CHƯA THANH TOÁN · COD</strong>
          <p>Thanh toán {formatPrice(total)} khi nhận hàng. Không cần chuyển khoản trước.</p>
        </div>
      </div>
      <div className="order-help">
        <IconHeadphones aria-hidden="true" />
        <div>
          <span>Cần hỗ trợ về đơn hàng của bạn?</span>
          <a href="mailto:hello@8threadtech.vn">
            NHẮN TIN CHO 8THREADS <IconArrowUpRight />
          </a>
        </div>
      </div>
    </aside>
  );
}
