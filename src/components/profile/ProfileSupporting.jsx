import { IconArrowUpRight } from "@tabler/icons-react";
import thread75 from "../../assets/list-thread-75.png";

export default function ProfileSupporting({ profile }) {
  return (
    <div className="profile-supporting" data-node-id="8:942">
      <article className="profile-address" id="default-address" data-node-id="8:943">
        <h2 data-node-id="8:944">ĐỊA CHỈ MẶC ĐỊNH</h2>
        <div className="profile-address-details" data-node-id="8:945">
          <div className="profile-recipient" data-node-id="8:946">
            <strong data-node-id="8:947">{profile.name}</strong>
            <span data-node-id="8:948">Nhà riêng</span>
          </div>
          <p>0987 654 123</p>
          <p>123 Đường Số 8, Phường Thủ Đức, TP. Hồ Chí Minh</p>
        </div>
        <div className="profile-rule" data-node-id="8:952" />
        <a className="profile-red-link" href="mailto:hello@8threadtech.vn" data-node-id="8:953">
          <span data-node-id="8:954">QUẢN LÝ ĐỊA CHỈ</span>
          <IconArrowUpRight data-node-id="8:955" />
        </a>
      </article>
      <article className="profile-order" id="recent-order" data-node-id="8:956">
        <div className="profile-order-heading" data-node-id="8:957">
          <h2 data-node-id="8:958">ĐƠN HÀNG GẦN NHẤT</h2>
          <a className="profile-red-link" href="/hoan-tat" data-node-id="8:959">
            <span data-node-id="8:960">XEM TẤT CẢ</span>
            <IconArrowUpRight data-node-id="8:961" />
          </a>
        </div>
        <div className="profile-order-meta" data-node-id="8:962">
          <strong data-node-id="8:963">#8TT-261027-0186</strong>
          <time data-node-id="8:964">27/10/2026</time>
        </div>
        <span className="profile-order-status" data-node-id="8:965">Đã tiếp nhận · Chờ xác nhận</span>
        <div className="profile-order-items" data-node-id="8:967">
          <div data-node-id="8:968">
            <img src={thread75} alt="Bàn phím THREAD 75" data-node-id="8:969" />
          </div>
          <p data-node-id="8:970">
            <strong data-node-id="8:971">THREAD 75, THREAD 65, THREAD 98</strong>
            <span data-node-id="8:972">3 sản phẩm · Chưa thanh toán · COD</span>
          </p>
        </div>
        <div className="profile-order-total" data-node-id="8:974">
          <strong data-node-id="8:975">6.570.000 ₫</strong>
          <a className="profile-red-link" href="/hoan-tat" data-node-id="8:976">
            <span data-node-id="8:977">XEM CHI TIẾT</span>
            <IconArrowUpRight data-node-id="8:978" />
          </a>
        </div>
      </article>
    </div>
  );
}