import { IconBuilding, IconHome, IconCircleCheck, IconPencil, IconTrash, IconPlus, IconChevronRight, IconLock } from "@tabler/icons-react";

export default function AddressPanel({ addresses, onAdd, onEdit, onDefault, onDelete }) {
  return (
    <div className="address-main" data-node-id="20:68">
      <section className="address-panel" data-node-id="20:69">
        <div className="address-panel-heading" data-node-id="20:70">
          <div>
            <h2 data-node-id="20:72">ĐỊA CHỈ GIAO HÀNG</h2>
            <p data-node-id="20:73">Quản lý địa chỉ để mỗi lần đặt hàng nhanh chóng hơn.</p>
          </div>
          <button className="address-add-button" onClick={() => onAdd(true)} data-node-id="20:74">
            <IconPlus data-node-id="20:177" />
            <span data-node-id="20:76">THÊM ĐỊA CHỈ MỚI</span>
          </button>
        </div>
        <div className="address-panel-rule" data-node-id="20:77" />
        <div className="address-list-overview" data-node-id="20:78">
          <strong data-node-id="20:79">Địa chỉ đã lưu ({addresses.length})</strong>
          <span data-node-id="20:80">Chỉ có một địa chỉ mặc định</span>
        </div>
        {addresses.length ? (
          <div className="address-list" data-node-id="20:81">
            {addresses.map((address) => (
              <article className={`saved-address${address.isDefault ? " is-default" : ""}`} key={address.id}>
                <div className="saved-address-top">
                  <span className="saved-address-type">
                    {address.label === "Văn phòng" ? <IconBuilding /> : <IconHome />}
                  </span>
                  <strong>{address.label.toLocaleUpperCase("vi")}</strong>
                </div>
                {address.isDefault && <span className="default-badge"><IconCircleCheck />Mặc định</span>}
                <div className="saved-address-recipient">
                  <div>
                    <strong>{address.recipient}</strong>
                    <span className="recipient-separator">|</span>
                    <span>{address.phone}</span>
                  </div>
                  <p>{address.address}</p>
                </div>
                <div className="saved-address-rule" />
                <div className="saved-address-actions">
                  {address.isDefault ? (
                    <span className="default-note">Được chọn sẵn khi thanh toán.</span>
                  ) : (
                    <button className="set-default-button" onClick={() => onDefault(address.id)}>
                      <IconLock /> Đặt làm mặc định
                    </button>
                  )}
                  <div className="saved-address-links">
                    <button onClick={() => onEdit(address)}>
                      <IconPencil /> Chỉnh sửa
                    </button>
                    <span aria-hidden="true">|</span>
                    <button className="delete-address-button" onClick={() => onDelete(address)}>
                      <IconTrash /> Xóa
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="address-empty">
            <IconMapPin />
            <h3>Chưa có địa chỉ giao hàng</h3>
            <p>Thêm địa chỉ để hoàn tất đơn hàng nhanh chóng hơn.</p>
            <button className="address-add-button" onClick={() => onAdd(true)}>
              <IconPlus /> THÊM ĐỊA CHỈ MỚI
            </button>
          </div>
        )}
      </section>
    </div>
  );
}