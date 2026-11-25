import { IconArrowUpRight } from "@tabler/icons-react";
import thread75 from "../../assets/list-thread-75.png";

export default function ProfileSupporting({ profile }) {
  const address = profile?.defaultAddress;
  const order = profile?.latestOrder;

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("vi-VN")
    : "";

  const orderProductsText = order?.items && order.items.length > 0
    ? order.items.map((i) => i.productName).join(", ")
    : "Đơn hàng 8Threads";

  const orderProductImg = order?.items?.[0]?.productImageUrl || thread75;

  return (
    <div className="profile-supporting" data-node-id="8:942">
      {/* KHỐI ĐỊA CHỈ MẶC ĐỊNH */}
      <article className="profile-address" id="default-address" data-node-id="8:943">
        <h2 data-node-id="8:944">ĐỊA CHỈ MẶC ĐỊNH</h2>
        {address ? (
          <div className="profile-address-details" data-node-id="8:945">
            <div className="profile-recipient" data-node-id="8:946">
              <strong data-node-id="8:947">{address.receiverName || profile.name}</strong>
              <span data-node-id="8:948">{address.addressType || "Nhà riêng"}</span>
            </div>
            <p>{address.receiverPhone || profile.phone || "Chưa có số điện thoại"}</p>
            <p>{address.fullAddress}</p>
          </div>
        ) : (
          <div className="profile-address-details" style={{ padding: "14px 0" }}>
            <p style={{ color: "#71717a", margin: 0 }}>
              Bạn chưa thiết lập địa chỉ mặc định trong sổ địa chỉ.
            </p>
          </div>
        )}
        <div className="profile-rule" data-node-id="8:952" />
        <a className="profile-red-link" href="/so-dia-chi" data-node-id="8:953">
          <span data-node-id="8:954">{address ? "QUẢN LÝ ĐỊA CHỈ" : "+ THÊM ĐỊA CHỈ"}</span>
          <IconArrowUpRight data-node-id="8:955" />
        </a>
      </article>

      {/* KHỐI ĐƠN HÀNG GẦN NHẤT */}
      <article className="profile-order" id="recent-order" data-node-id="8:956">
        <div className="profile-order-heading" data-node-id="8:957">
          <h2 data-node-id="8:958">ĐƠN HÀNG GẦN NHẤT</h2>
          <a className="profile-red-link" href="/don-hang" data-node-id="8:959">
            <span data-node-id="8:960">XEM TẤT CẢ</span>
            <IconArrowUpRight data-node-id="8:961" />
          </a>
        </div>

        {order ? (
          <>
            <div className="profile-order-meta" data-node-id="8:962">
              <strong data-node-id="8:963">#{order.orderCode}</strong>
              {orderDate && <time data-node-id="8:964">{orderDate}</time>}
            </div>
            <span className="profile-order-status" data-node-id="8:965">
              {order.statusLabel || order.status || "Đang xử lý"}
            </span>
            <div className="profile-order-items" data-node-id="8:967">
              <div data-node-id="8:968">
                <img src={orderProductImg} alt="Sản phẩm đơn hàng" data-node-id="8:969" />
              </div>
              <p data-node-id="8:970">
                <strong data-node-id="8:971">{orderProductsText}</strong>
                <span data-node-id="8:972">
                  {order.totalQuantity || order.items?.length || 1} sản phẩm · {order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"} · {order.paymentMethod || "COD"}
                </span>
              </p>
            </div>
            <div className="profile-order-total" data-node-id="8:974">
              <strong data-node-id="8:975">
                {Number(order.totalAmount || 0).toLocaleString("vi-VN")} ₫
              </strong>
              <a className="profile-red-link" href={`/don-hang/${order.orderCode || order.id}`} data-node-id="8:976">
                <span data-node-id="8:977">XEM CHI TIẾT</span>
                <IconArrowUpRight data-node-id="8:978" />
              </a>
            </div>
          </>
        ) : (
          <div style={{ padding: "16px 0" }}>
            <p style={{ color: "#71717a", marginBottom: 12 }}>
              Bạn chưa có đơn hàng nào được ghi nhận.
            </p>
            <a className="profile-red-link" href="/ban-phim">
              <span>KHÁM PHÁ BÀN PHÍM 8THREADS</span>
              <IconArrowUpRight />
            </a>
          </div>
        )}
      </article>
    </div>
  );
}
