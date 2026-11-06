import { IconMinus, IconPlus, IconTrash, IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;

export default function CartList({ items, savings, onChangeQuantity, onRemove }) {
  return (
    <div className="cart-list" data-node-id="3:391">
      <div className="cart-columns">
        <span>SẢN PHẨM</span>
        <span>SỐ LƯỢNG</span>
        <span>THÀNH TIỀN</span>
      </div>
      {items.length ? (
        <>
          <div className="cart-items">
            {items.map((item, index) => (
              <article className="cart-item" key={item.id} data-node-id={["3:396", "3:420", "3:443"][index]}>
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <h2>{item.name}</h2>
                  <p>{item.color}</p>
                  <span>{item.switch}</span>
                  <small>{item.specs}</small>
                  <div className="cart-stock">
                    <i />Có sẵn · Giao trong 24h
                  </div>
                </div>
                <div className="cart-quantity" aria-label={`Số lượng ${item.name}`}>
                  <button aria-label={`Giảm số lượng ${item.name}`} onClick={() => onChangeQuantity(item.id, -1)}>
                    <IconMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button aria-label={`Tăng số lượng ${item.name}`} onClick={() => onChangeQuantity(item.id, 1)}>
                    <IconPlus />
                  </button>
                </div>
                <div className="cart-item-total">
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                  {item.oldPrice && <del>{formatPrice(item.oldPrice * item.quantity)}</del>}
                  <button onClick={() => onRemove(item.id)} aria-label={`Xóa ${item.name}`}>
                    <IconTrash />Xóa
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="cart-continue">
            <a href="/">
              <IconArrowLeft />TIẾP TỤC MUA SẮM
            </a>
            <span>Bạn đã tiết kiệm {formatPrice(savings)} từ giá gốc.</span>
          </div>
        </>
      ) : (
        <div className="cart-empty">
          <h2>Giỏ hàng đang trống</h2>
          <p>Khám phá những chiếc bàn phím phù hợp với nhịp gõ của bạn.</p>
          <a href="/">
            TIẾP TỤC MUA SẮM <IconArrowRight />
          </a>
        </div>
      )}
    </div>
  );
}
