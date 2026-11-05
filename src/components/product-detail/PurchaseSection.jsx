import { IconArrowUpRight, IconShoppingBag } from "@tabler/icons-react";

const colors = [
  { name: "Bạc ánh trăng", color: "#c8c9ca" },
  { name: "Đen", color: "#393b3d" },
  { name: "Đỏ", color: "#a82125" },
];

export default function PurchaseSection({ color, onColorChange, onComingSoon }) {
  return (
    <section className="purchase" data-node-id="3:1165">
      {/* Chọn màu */}
      <div className="color-select">
        <div className="small-label">PHỐI MÀU CỦA BẠN</div>
        <div className="swatches">
          {colors.map((item, index) => (
            <button
              key={item.name}
              className={color === index ? "selected" : ""}
              onClick={() => onColorChange(index)}
              aria-label={item.name}
              aria-pressed={color === index}
            >
              <span style={{ background: item.color }} />
            </button>
          ))}
        </div>
        <strong>{colors[color].name}</strong>
        <p>Linear Red Switch · Êm &amp; mượt</p>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-info">
        <div className="product-title">
          <h1>THREAD 75</h1>
          <span>MỚI RA MẮT</span>
        </div>
        <p>Từng phím gõ, một nhịp cảm hứng. Thiết kế 75% gọn gàng, hoàn thiện cho cả làm việc lẫn cuộc chơi.</p>
        <div className="features">
          <span>Nhôm CNC</span>
          <span>Hot-swap</span>
          <span>3 chế độ kết nối</span>
        </div>
      </div>

      {/* Giá & nút mua */}
      <div className="purchase-action">
        <div className="price">
          <strong>2.490.000 ₫</strong>
          <del>2.790.000 ₫</del>
        </div>
        <div className="purchase-buttons">
          <button className="buy-button" onClick={() => onComingSoon("Đặt hàng")}>
            MUA NGAY <IconArrowUpRight size={18} />
          </button>
          <button className="add-button" onClick={() => onComingSoon("Giỏ hàng")}>
            <IconShoppingBag size={18} /> THÊM VÀO GIỎ
          </button>
        </div>
        <p className="stock"><span />Có sẵn · Sẵn sàng giao trong 24h</p>
      </div>
    </section>
  );
}

export { colors };

