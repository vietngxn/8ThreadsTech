import { useState } from "react";
import { IconArrowUpRight, IconStar } from "@tabler/icons-react";

const formatPrice = (price) => `${Number(price || 0).toLocaleString("vi-VN")} ₫`;

function OrderCard({ order, onCancel, onPay }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSent, setReviewSent] = useState(false);
  const [paying, setPaying] = useState(false);

  const detailHref = `/don-hang/${order.orderCode}`;
  const itemCount = order.products.reduce((sum, p) => sum + p.quantity, 0);

  const handlePay = async () => {
    setPaying(true);
    await onPay(order.orderCode); // thành công thì trình duyệt đã rời trang
    setPaying(false);
  };

  return (
    <article className={`order-card order-card--${order.status}`} data-node-id={order.nodeId}>
      <header className="order-card-header" data-node-id="12:799">
        <div className="order-number">
          <strong data-node-id="12:801">{order.id}</strong>
          <span data-node-id="12:802">Ngày đặt: {order.date}</span>
        </div>
        <div className="order-status-block">
          <span className="order-overline">TRẠNG THÁI ĐƠN HÀNG</span>
          <span className={`order-status order-status--${order.status}`}>{order.statusLabel}</span>
        </div>
        <div className="order-payment">
          <span className="order-overline">THANH TOÁN</span>
          <span>{order.payment}</span>
        </div>
      </header>

      <div className="order-products">
        {order.products.map((product, index) => (
          <div className="order-product" key={`${order.id}-${index}`} data-node-id="12:811">
            <div className="order-product-image"><img src={product.image} alt={product.name} /></div>
            <div className="order-product-info">
              <strong>{product.name}</strong>
              {product.variant && <span>{product.variant}</span>}
            </div>
            <span className="order-product-quantity">× {product.quantity}</span>
            <strong className="order-product-price">{formatPrice(product.price * product.quantity)}</strong>
          </div>
        ))}
      </div>

      <footer className="order-card-footer">
        <div className="order-total">
          <div><span>{itemCount} sản phẩm · Tổng tiền</span><strong>{formatPrice(order.total)}</strong></div>
          <small>{order.delivery}</small>
        </div>
        <div className="order-actions">
          {/* Nút hiện theo canPay/canCancel do BE tính, FE không tự suy luận từ trạng thái */}
          {order.canPay && (
            <button className="order-button order-button--primary" onClick={handlePay} disabled={paying}>
              {paying ? "ĐANG CHUYỂN..." : "THANH TOÁN"} <IconArrowUpRight />
            </button>
          )}
          {order.canCancel && !confirmCancel && (
            <button className="order-button order-button--secondary" onClick={() => setConfirmCancel(true)}>HỦY ĐƠN HÀNG</button>
          )}
          {order.canCancel && confirmCancel && (
            <div className="order-cancel-confirm" role="group" aria-label="Xác nhận hủy đơn hàng">
              <span>Hủy đơn này?</span>
              <button onClick={() => onCancel(order.orderCode)}>Xác nhận</button>
              <button onClick={() => setConfirmCancel(false)}>Giữ đơn</button>
            </div>
          )}
          {order.status !== "delivered" && order.status !== "cancelled" ? (
            <a className="order-button order-button--secondary" href={detailHref}>XEM CHI TIẾT</a>
          ) : (
            <button className="order-button order-button--secondary" aria-expanded={detailsOpen} onClick={() => setDetailsOpen((open) => !open)}>
              {detailsOpen ? "ĐÓNG CHI TIẾT" : "XEM CHI TIẾT"}
            </button>
          )}
          {order.status === "shipping" && <a className="order-button order-button--primary" href={detailHref}>THEO DÕI ĐƠN <IconArrowUpRight /></a>}
          {(order.status === "delivered" || order.status === "cancelled") && <a className="order-button order-button--primary" href="/san-pham">MUA LẠI <IconArrowUpRight /></a>}
        </div>
      </footer>

      {detailsOpen && (
        <div className="order-details" data-node-id="12:836">
          <div><span>MÃ ĐƠN HÀNG</span><strong>{order.id}</strong></div>
          <div><span>ĐỊA CHỈ GIAO HÀNG</span><strong>{order.deliveryAddress || order.delivery || "Theo địa chỉ đặt hàng"}</strong></div>
          <div><span>PHƯƠNG THỨC THANH TOÁN</span><strong>{order.payment}</strong></div>
        </div>
      )}

      {order.review && (
        <section className="order-review" aria-labelledby={`review-${order.id}`} data-node-id="40:121">
          <div className="order-review-heading">
            <h3 id={`review-${order.id}`}>Đánh giá sản phẩm</h3>
            <span>ĐÁNH GIÁ SAU KHI GIAO</span>
          </div>
          <p className="order-review-note">Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã được giao. Đánh giá này dành riêng cho sản phẩm {order.products[0].name} trong đơn {order.id}.</p>
          <div className="review-product">
            <div className="review-product-image">
              <img src={order.products[0].image} alt={order.products[0].name} />
            </div>
            <div>
              <strong>{order.products[0].name}</strong>
              <span>{order.products[0].variant}</span>
            </div>
          </div>
          <div className="review-rating">
            <span>Đánh giá của bạn</span>
            <div className="review-stars" role="radiogroup" aria-label="Chọn số sao">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className={star <= rating ? "filled" : ""} onClick={() => setRating(star)} aria-label={`${star} sao`}><IconStar size={20} aria-hidden="true" /></button>
              ))}
            </div>
          </div>
          <textarea className="review-comment" placeholder="Chia sẻ trải nghiệm của bạn..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
          {reviewSent ? (
            <p className="review-thanks">Cảm ơn bạn đã đánh giá!</p>
          ) : (
            <button className="order-button order-button--primary review-submit" onClick={() => setReviewSent(true)}>GỬI ĐÁNH GIÁ</button>
          )}
        </section>
      )}
    </article>
  );
}

export default function OrdersList({ orders, onCancel, onPay }) {
  return (
    <div className="orders-list" data-node-id="12:788">
      {orders.map((order, index) => (
        <OrderCard key={order.id} order={{...order, nodeId: `12:${790 + index * 10}`}} onCancel={onCancel} onPay={onPay} />
      ))}
      {orders.length === 0 && <p className="orders-empty">Không có đơn hàng nào phù hợp.</p>}
    </div>
  );
}