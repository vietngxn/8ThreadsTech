
import {
  IconMinus,
  IconPlus,
  IconTrash,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";

const formatPrice = (price) =>
  `${(price || 0).toLocaleString("vi-VN")} ₫`;

export default function CartList({
  items,
  savings,
  selectedCartItemIds = [],
  onToggleItem = () => { },
  onChangeQuantity,
  onRemove,
}) {
  return (
    <div className="cart-list" data-node-id="3:391">
      <div className="cart-columns">
        <span>SẢN PHẨM</span>
        <span>SỐ LƯỢNG</span>
        <span>THÀNH TIỀN</span>
        <span>CHỌN</span>
      </div>

      {items.length ? (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <article
                className="cart-item"
                key={item.cartItemId}
              >
                <div className="cart-item-image">
                  <a
                    href={`/ban-phim/${item.slug || item.productVariantId}`}
                    aria-label={`Xem chi tiết ${item.name}`}
                  >
                    <img src={item.image} alt={item.name} />
                  </a>
                </div>

                <div className="cart-item-info">
                  <h2>
                    <a
                      href={`/ban-phim/${item.slug || item.productVariantId}`}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      {item.name}
                    </a>
                  </h2>

                  <p>{item.color}</p>
                  <span>{item.switch}</span>
                  <small>{item.specs}</small>

                  <div className="cart-stock">
                    <i />
                    {item.stockQuantity <= 0
                      ? "Hết hàng"
                      : item.stockQuantity < item.quantity
                        ? `Chỉ còn ${item.stockQuantity} sản phẩm`
                        : item.stockQuantity < 10
                          ? `Sắp hết · còn ${item.stockQuantity}`
                          : "Có sẵn · Giao trong 24h"}
                  </div>
                </div>

                <div
                  className="cart-quantity"
                  aria-label={`Số lượng ${item.name}`}
                >
                  <button
                    aria-label={`Giảm số lượng ${item.name}`}
                    onClick={() =>
                      onChangeQuantity(item.cartItemId, -1)
                    }
                  >
                    <IconMinus />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    aria-label={`Tăng số lượng ${item.name}`}
                    onClick={() =>
                      onChangeQuantity(item.cartItemId, 1)
                    }
                  >
                    <IconPlus />
                  </button>
                </div>

                <div className="cart-item-total">
                  <strong>
                    {formatPrice(item.price * item.quantity)}
                  </strong>

                  {item.oldPrice && (
                    <del>
                      {formatPrice(item.oldPrice * item.quantity)}
                    </del>
                  )}

                  <button
                    onClick={() => onRemove(item.cartItemId)}
                    aria-label={`Xóa ${item.name}`}
                  >
                    <IconTrash />
                    Xóa
                  </button>
                </div>

                <div className="cart-item-select">
                  <input
                    type="checkbox"
                    checked={selectedCartItemIds.includes(item.cartItemId)}
                    onChange={() => onToggleItem(item.cartItemId)}
                    style={{
                      width: 18,
                      height: 18,
                      cursor: "pointer",
                      accentColor: "#6366f1",
                    }}
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="cart-continue">
            <a href="/ban-phim">
              <IconArrowLeft />
              TIẾP TỤC MUA SẮM
            </a>

            {savings > 0 && (
              <span>
                Bạn đã tiết kiệm {formatPrice(savings)} từ giá gốc.
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="cart-empty">
          <h2>Giỏ hàng đang trống</h2>
          <p>
            Khám phá những chiếc bàn phím phù hợp với nhịp gõ của bạn.
          </p>

          <a href="/ban-phim">
            KHÁM PHÁ BÀN PHÍM <IconArrowRight />
          </a>
        </div>
      )}
    </div>
  );
}
