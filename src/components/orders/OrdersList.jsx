import { useState } from "react";
import CancelReasonForm from "../order/CancelReasonForm";
import ReviewModal from "./ReviewModal";
import { IconArrowUpRight, IconCheck, IconStar } from "@tabler/icons-react";

const formatPrice = (price) => `${Number(price || 0).toLocaleString("vi-VN")} ₫`;

function OrderCard({ order, onCancel, onPay, onOpenReview }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [paying, setPaying] = useState(false);

  const detailHref = `/don-hang/${order.orderCode}`;
  const itemCount = order.products.reduce((sum, p) => sum + p.quantity, 0);
  const isDelivered = order.rawStatus === "DELIVERED" || (!order.rawStatus && order.status === "delivered");

  const handlePay = async () => {
    setPaying(true);
    await onPay(order.orderCode);
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
          <div className="order-product" key={product.id || `${order.id}-${index}`} data-node-id="12:811">
            <div className="order-product-image"><img src={product.image} alt={product.name} /></div>
            <div className="order-product-info">
              <strong>{product.name}</strong>
              {product.variant && <span>{product.variant}</span>}
              {isDelivered && (
                <div className="order-item-review-inline">
                  {product.reviewed ? (
                    <span className="order-reviewed-badge">
                      <IconCheck size={12} /> Đã đánh giá
                    </span>
                  ) : (
                    product.id &&
                    product.productId && (
                      <button
                        type="button"
                        className="order-button order-button--secondary order-item-review-btn"
                        onClick={() =>
                          onOpenReview({
                            orderItemId: product.id,
                            productId: product.productId,
                            name: product.name,
                            variant: product.variant,
                            image: product.image,
                            orderCode: order.orderCode,
                          })
                        }
                      >
                        <IconStar size={13} /> ĐÁNH GIÁ
                      </button>
                    )
                  )}
                </div>
              )}
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
          {order.canPay && (
            <button className="order-button order-button--primary" onClick={handlePay} disabled={paying}>
              {paying ? "ĐANG CHUYỂN..." : "THANH TOÁN"} <IconArrowUpRight />
            </button>
          )}
          {order.canCancel && !confirmCancel && (
            <button className="order-button order-button--secondary" onClick={() => setConfirmCancel(true)}>HỦY ĐƠN HÀNG</button>
          )}
          {order.canCancel && confirmCancel && (
            <CancelReasonForm
              onConfirm={(reason) => onCancel(order.orderCode, reason)}
              onClose={() => setConfirmCancel(false)}
            />
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
    </article>
  );
}

export default function OrdersList({
  orders,
  onCancel,
  onPay,
  onReviewSuccess,
  onAlreadyReviewed,
  onReloadOrders,
}) {
  const [reviewTarget, setReviewTarget] = useState(null);

  return (
    <div className="orders-list" data-node-id="12:788">
      {orders.map((order, index) => (
        <OrderCard
          key={order.id}
          order={{ ...order, nodeId: `12:${790 + index * 10}` }}
          onCancel={onCancel}
          onPay={onPay}
          onOpenReview={setReviewTarget}
        />
      ))}
      {orders.length === 0 && <p className="orders-empty">Không có đơn hàng nào phù hợp.</p>}

      {reviewTarget && (
        <ReviewModal
          item={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSuccess={(orderItemId, _data, msg) => {
            setReviewTarget(null);
            onReviewSuccess?.(orderItemId, msg);
          }}
          onAlreadyReviewed={(orderItemId, msg) => {
            onAlreadyReviewed?.(orderItemId, msg);
          }}
          onReloadOrder={onReloadOrders}
        />
      )}
    </div>
  );
}
