import { IconArrowUpRight, IconHeadphones } from "@tabler/icons-react";
import thread75 from "../../assets/list-thread-75.png";
import thread65 from "../../assets/list-thread-65.png";
import thread98 from "../../assets/list-thread-98.png";

const items = [
  { name: "THREAD 75", color: "Bạc ánh trăng", switch: "Linear Red Switch", price: 2490000, oldPrice: 2790000, image: thread75 },
  { name: "THREAD 65", color: "Đen nguyên bản", switch: "Linear Switch", price: 1890000, image: thread65 },
  { name: "THREAD 98", color: "Trắng sương", switch: "Tactile Brown Switch", price: 2190000, oldPrice: 2490000, image: thread98 },
];

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;

export default function OrderSummary({ items: itemsProp = items, total, saved }) {
  const displayItems = itemsProp || items;
  const displayTotal = total || displayItems.reduce((sum, item) => sum + item.price, 0);
  const displaySaved = saved || displayItems.reduce((sum, item) => sum + (item.oldPrice ?? item.price) - item.price, 0);

  return (
    <aside className="order-summary-column">
      <div className="order-summary-card" id="don-hang" data-node-id="5:600">
        <header className="order-summary-heading">
          <h2>ĐƠN HÀNG CỦA BẠN</h2>
          <span>{displayItems.length} sản phẩm / {displayItems.length} món</span>
        </header>
        <div className="order-products">
          {displayItems.map((item, index) => (
            <article className="order-product" key={item.name} data-node-id={["5:605", "5:617", "5:628"][index]}>
              <div className="order-product-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="order-product-info">
                <div className="order-product-title">
                  <h3>{item.name}</h3>
                  <span>× 1</span>
                </div>
                <p>{item.color}</p>
                <small>{item.switch}</small>
                <div className="order-product-price">
                  <strong>{formatPrice(item.price)}</strong>
                  {item.oldPrice && <del>{formatPrice(item.oldPrice)}</del>}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="order-costs">
          <div>
            <span>Tạm tính ({displayItems.length} sản phẩm)</span>
            <strong>{formatPrice(displayTotal)}</strong>
          </div>
          <div>
            <span>Giảm giá</span>
            <strong>0 ₫</strong>
          </div>
          <div>
            <span>Phí vận chuyển</span>
            <strong className="order-free">Miễn phí</strong>
          </div>
        </div>
        <div className="order-summary-rule" />
        <div className="order-grand-total">
          <div>
            <strong>TỔNG CỘNG</strong>
            <b>{formatPrice(displayTotal)}</b>
          </div>
          <small>Đã bao gồm VAT</small>
          <p>Bạn đã tiết kiệm {formatPrice(displaySaved)} từ giá gốc.</p>
        </div>
        <div className="order-payment-note">
          <strong>CHƯA THANH TOÁN · COD</strong>
          <p>Thanh toán {formatPrice(displayTotal)} khi nhận hàng. Không cần chuyển khoản trước.</p>
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