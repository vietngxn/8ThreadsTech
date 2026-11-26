import { useState } from "react";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCheck,
  IconChevronRight,
  IconCreditCard,
  IconLock,
  IconLogout,
  IconMapPin,
  IconPackage,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import thread75 from "../../assets/list-thread-75.png";
import { authService } from "../../services/authService";

const orderSteps = ["Đã tiếp nhận", "Chờ xác nhận", "Đã xác nhận", "Đang giao hàng", "Đã giao hàng"];
const formatPrice = (price) => `${Number(price || 0).toLocaleString("vi-VN")} ₫`;

function AccountSidebar() {
  const currentUser = authService.getCurrentUser();
  const displayName = currentUser?.fullName || currentUser?.name || "Khách hàng 8Threads";
  const displayEmail = currentUser?.email || "";

  const getInitials = (name) => {
    if (!name) return "8T";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <aside className="order-detail-sidebar" data-node-id="15:1274">
      <div className="order-detail-identity" data-node-id="15:1275">
        <div className="order-detail-avatar">{getInitials(displayName)}</div>
        <div className="order-detail-identity-copy">
          <strong>{displayName}</strong>
          <span>{displayEmail}</span>
        </div>
        <small>TÀI KHOẢN NGƯỜI DÙNG</small>
      </div>
      <div className="order-detail-sidebar-rule" />
      <nav className="order-detail-account-menu" aria-label="Điều hướng tài khoản">
        <a href="/ho-so"><IconUser /><span>Hồ sơ cá nhân</span></a>
        <a className="is-active" href="/don-hang" aria-current="page">
          <IconPackage /><span>Đơn hàng của tôi</span><IconChevronRight />
        </a>
        <a href="/so-dia-chi"><IconMapPin /><span>Sổ địa chỉ</span></a>
        <a href="/doi-mat-khau"><IconLock /><span>Đổi mật khẩu</span></a>
        <button
          type="button"
          className="profile-logout"
          onClick={() => authService.logout("/dang-nhap")}
        >
          <IconLogout />
          <span>Đăng xuất</span>
        </button>
      </nav>
      <div className="order-detail-sidebar-rule order-detail-help-rule" />
      <div className="order-detail-help">
        <p>Cần hỗ trợ về tài khoản của bạn?</p>
        <a href="mailto:hello@8threadtech.vn">NHẮN TIN CHO 8THREADS <IconArrowUpRight /></a>
      </div>
    </aside>
  );
}

function OrderProgress({ status, orderDate }) {
  const normalizedStatus = (status || "").toUpperCase();
  const isCancelled = normalizedStatus === "CANCELLED";

  // Determine which step is currently active or completed
  let activeStep = 1;
  let completedUntil = 0;

  if (isCancelled) {
    activeStep = -1;
    completedUntil = -1;
  } else if (normalizedStatus === "DELIVERED") {
    activeStep = -1;
    completedUntil = 4;
  } else if (normalizedStatus === "SHIPPING") {
    activeStep = 3;
    completedUntil = 2;
  } else if (normalizedStatus === "CONFIRMED") {
    activeStep = 2;
    completedUntil = 1;
  } else {
    // PENDING
    activeStep = 1;
    completedUntil = 0;
  }

  return (
    <div
      className="order-progress"
      aria-label={isCancelled ? "Đơn hàng đã hủy" : `Tiến trình đơn hàng: ${status}`}
      data-node-id="15:1326"
    >
      {orderSteps.map((step, index) => {
        const isComplete = !isCancelled && index <= completedUntil;
        const isActive = !isCancelled && index === activeStep;
        return (
          <div
            className={`order-progress-step${isComplete ? " is-complete" : ""}${isActive ? " is-active" : ""}`}
            key={step}
          >
            <div className="order-progress-marker">
              {isComplete ? (
                <IconCheck aria-hidden="true" />
              ) : isActive ? (
                <span className="order-progress-pulse" />
              ) : (
                <span>{String(index + 1).padStart(2, "0")}</span>
              )}
            </div>
            <strong>{step}</strong>
            <small>
              {isComplete && index === 0
                ? orderDate || "Đã xong"
                : isComplete
                  ? "Đã xong"
                  : isActive
                    ? "Đang xử lý"
                    : "Chưa diễn ra"}
            </small>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailMain({ order, onCancel }) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  if (!order) {
    return (
      <div className="order-detail-layout" data-node-id="15:1270">
        <AccountSidebar />
        <div className="order-detail-main" data-node-id="15:1306" style={{ padding: "40px 20px" }}>
          <h2>Không tìm thấy thông tin đơn hàng</h2>
          <p style={{ color: "#71717a", marginTop: 8 }}>
            Vui lòng kiểm tra lại mã đơn hàng hoặc quay lại danh sách đơn hàng.
          </p>
          <a
            href="/don-hang"
            className="order-button order-button--primary"
            style={{ display: "inline-block", marginTop: 16 }}
          >
            QUAY LẠI ĐƠN HÀNG CỦA TÔI
          </a>
        </div>
      </div>
    );
  }

  const effectiveStatus = order.status || "PENDING";
  const isCancelled = effectiveStatus === "CANCELLED";
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "";
  const items = order.items && order.items.length > 0 ? order.items : [];
  const totalQuantity = order.totalQuantity || items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const subtotal = Number(order.subtotalAmount || 0);
  const shipping = Number(order.shippingFee || 0);
  const discount = Number(order.discountAmount || 0);
  const total = Number(order.totalAmount || (subtotal + shipping - discount));

  const paymentText = `${order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"} · ${order.paymentMethod || "COD"}`;

  return (
    <div className="order-detail-layout" data-node-id="15:1270">
      <AccountSidebar />
      <div className="order-detail-main" data-node-id="15:1306">
        <section className="order-status-section" data-node-id="15:1307">
          <a className="order-detail-back" href="/don-hang" data-node-id="15:1308">
            <IconArrowLeft />QUAY LẠI ĐƠN HÀNG CỦA TÔI
          </a>
          <div className="order-status-card" data-node-id="15:1311">
            <div className="order-status-summary">
              <div className="order-number">
                <strong>#{order.orderCode}</strong>
                <span>Ngày đặt: {orderDate} · {totalQuantity} sản phẩm</span>
              </div>
              <div className="order-status-block">
                <span className="order-overline">TRẠNG THÁI ĐƠN HÀNG</span>
                <span className={`order-status${isCancelled ? " is-cancelled" : ""}`}>
                  {isCancelled ? "Đã hủy đơn hàng" : (order.statusLabel || effectiveStatus)}
                </span>
              </div>
              <div className="order-payment">
                <span className="order-overline">THANH TOÁN</span>
                <span>{paymentText}</span>
              </div>
            </div>
            <div className="order-tracking">
              <h2>TIẾN TRÌNH ĐƠN HÀNG</h2>
              <OrderProgress status={effectiveStatus} orderDate={orderDate} />
              <p>
                {isCancelled
                  ? "Đơn hàng đã được hủy."
                  : effectiveStatus === "DELIVERED"
                    ? "Đơn hàng đã giao thành công đến quý khách."
                    : "8ThreadTech đã tiếp nhận đơn hàng và đang xử lý theo quy trình."}
              </p>
            </div>
          </div>
        </section>

        <section className="order-detail-products" data-node-id="15:1362">
          <div className="order-detail-section-heading">
            <h2>SẢN PHẨM TRONG ĐƠN</h2>
            <span>{totalQuantity} sản phẩm</span>
          </div>
          <div className="order-detail-product-list">
            {items.map((product) => (
              <article className="order-detail-product" key={product.id || product.productSku || product.productName}>
                <div className="order-detail-product-image">
                  <img src={product.productImageUrl || thread75} alt={product.productName} />
                </div>
                <div className="order-detail-product-info">
                  <strong>{product.productName}</strong>
                  <span>{product.selectedOptions || "Bàn phím cơ cao cấp"}</span>
                </div>
                <div className="order-detail-quantity">
                  <small>SỐ LƯỢNG</small>
                  <span>× {product.quantity || 1}</span>
                </div>
                <div className="order-detail-price">
                  <strong>{formatPrice(product.unitPrice)}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="order-detail-columns">
          <div className="order-detail-delivery-column">
            <section className="order-detail-panel order-address" data-node-id="15:1404">
              <h2><IconMapPin />ĐỊA CHỈ NHẬN HÀNG</h2>
              <div className="order-detail-rule" />
              <div className="order-recipient">
                <strong>{order.customerName || "Khách hàng 8Threads"}</strong>
                <span>{order.customerPhone || ""}</span>
                <p>{order.deliveryAddress || "Chưa có thông tin địa chỉ"}</p>
              </div>
            </section>
            <section className="order-detail-panel order-shipping" data-node-id="15:1413">
              <h2><IconTruck />THÔNG TIN VẬN CHUYỂN</h2>
              <div className="order-shipping-service">
                <strong>Giao hàng tiêu chuẩn</strong>
                <b>{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</b>
              </div>
              <p>Dự kiến 2–5 ngày làm việc sau khi xác nhận đơn hàng.</p>
              <div className="order-detail-rule" />
              <div className="order-shipping-meta">
                <div><span>Đơn vị vận chuyển</span><span>Chưa cập nhật</span></div>
                <div><span>Mã vận đơn</span><span>Chưa có</span></div>
              </div>
              <small>Đơn hàng chưa được bàn giao cho đơn vị vận chuyển.</small>
            </section>
            <div className="order-detail-contact">
              <strong>Cần thay đổi thông tin hoặc hỗ trợ đơn hàng?</strong>
              <p>Liên hệ 8Threads và cung cấp mã #{order.orderCode} để được hỗ trợ.</p>
              <a href="mailto:hello@8threadtech.vn">NHẮN TIN CHO 8THREADS <IconArrowUpRight /></a>
            </div>
          </div>

          <div className="order-payment-column">
            <section className="order-detail-panel order-payment-card" data-node-id="15:1437">
              <h2>THANH TOÁN ĐƠN HÀNG</h2>
              <div className="order-payment-method">
                <IconCreditCard />
                <div>
                  <strong>{order.paymentMethod || "COD"}</strong>
                  <span>{paymentText}</span>
                </div>
              </div>
              <div className="order-detail-rule" />
              <div className="order-payment-costs">
                <div>
                  <span>Tạm tính ({totalQuantity} sản phẩm)</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
                {discount > 0 && (
                  <div>
                    <span>Giảm giá</span>
                    <strong style={{ color: "#22c55e" }}>-{formatPrice(discount)}</strong>
                  </div>
                )}
                <div>
                  <span>Phí vận chuyển</span>
                  <strong className={shipping === 0 ? "is-free" : ""}>
                    {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
                  </strong>
                </div>
              </div>
              <div className="order-detail-rule" />
              <div className="order-grand-total">
                <div>
                  <strong>TỔNG CỘNG</strong>
                  <b>{formatPrice(total)}</b>
                </div>
                <small>Đã bao gồm VAT</small>
              </div>
              {order.paymentMethod === "COD" && (
                <div className="order-cod-note">
                  <strong>Thanh toán {formatPrice(total)} khi nhận hàng.</strong>
                  <span>Không yêu cầu chuyển khoản trước.</span>
                </div>
              )}
            </section>
            <div className="order-detail-actions">
              {isCancelled ? null : effectiveStatus === "PENDING" && (
                <>
                  {!confirmCancel ? (
                    <button
                      type="button"
                      className="order-cancel-button"
                      onClick={() => setConfirmCancel(true)}
                    >
                      HỦY ĐƠN HÀNG
                    </button>
                  ) : (
                    <div className="order-cancel-confirm" role="group" aria-label="Xác nhận hủy đơn hàng">
                      <span>Bạn có chắc chắn muốn hủy đơn này?</span>
                      <button
                        type="button"
                        disabled={cancelling}
                        onClick={async () => {
                          setCancelling(true);
                          setCancelError("");
                          try {
                            await onCancel?.();
                            setConfirmCancel(false);
                          } catch (err) {
                            setCancelError(err.message || "Không thể hủy đơn hàng");
                          } finally {
                            setCancelling(false);
                          }
                        }}
                      >
                        {cancelling ? "Đang hủy..." : "Xác nhận"}
                      </button>
                      <button
                        type="button"
                        disabled={cancelling}
                        onClick={() => setConfirmCancel(false)}
                      >
                        Không, giữ đơn
                      </button>
                    </div>
                  )}
                  {cancelError && (
                    <p role="alert" style={{ color: "#ef4444", marginTop: 8 }}>
                      {cancelError}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
