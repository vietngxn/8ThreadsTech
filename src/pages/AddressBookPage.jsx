import { useState } from "react";
import {
  IconArrowUpRight,
  IconBuilding,
  IconCheck,
  IconChevronRight,
  IconCircleCheck,
  IconHome,
  IconLock,
  IconLogout,
  IconMapPin,
  IconPackage,
  IconPencil,
  IconPlus,
  IconSearch,
  IconShoppingBag,
  IconTrash,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import logo from "../assets/thread-logo.png";
import { CartFooter } from "./CartPage.jsx";
import "./AddressBookPage.css";

const initialAddresses = [
  {
    id: "home",
    label: "Nhà riêng",
    recipient: "Nguyễn Minh An",
    phone: "0987 654 123",
    address: "123 Đường Số 8, Phường Thủ Đức, TP. Hồ Chí Minh",
    isDefault: true,
  },
  {
    id: "office",
    label: "Văn phòng",
    recipient: "Nguyễn Minh An",
    phone: "0987 654 123",
    address: "Tầng 5, 72 Nguyễn Cơ Thạch, Phường An Khánh, TP. Hồ Chí Minh",
    isDefault: false,
  },
];

const emptyForm = { label: "Nhà riêng", recipient: "", phone: "", address: "", isDefault: false };

function AddressForm({ address, onClose, onSave }) {
  const [form, setForm] = useState(address ? { ...address } : emptyForm);
  const update = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div className="address-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="address-modal" role="dialog" aria-modal="true" aria-labelledby="address-modal-title">
        <header className="address-modal-heading">
          <div><span>THÔNG TIN GIAO HÀNG</span><h2 id="address-modal-title">{address ? "CHỈNH SỬA ĐỊA CHỈ" : "THÊM ĐỊA CHỈ MỚI"}</h2></div>
          <button type="button" className="address-icon-button" onClick={onClose} aria-label="Đóng"><IconX /></button>
        </header>
        <form onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
          <label className="address-form-field">Tên gợi nhớ<select name="label" value={form.label} onChange={update}><option>Nhà riêng</option><option>Văn phòng</option><option>Khác</option></select></label>
          <label className="address-form-field">Họ và tên người nhận<input name="recipient" value={form.recipient} onChange={update} required autoComplete="name" /></label>
          <label className="address-form-field">Số điện thoại<input name="phone" type="tel" value={form.phone} onChange={update} required autoComplete="tel" /></label>
          <label className="address-form-field">Địa chỉ giao hàng<textarea name="address" value={form.address} onChange={update} rows="3" required autoComplete="street-address" /></label>
          <label className="address-default-option"><input type="checkbox" name="isDefault" checked={form.isDefault} onChange={update} /><span><IconCheck /></span>Đặt làm địa chỉ mặc định</label>
          <footer className="address-modal-actions"><button type="button" className="address-secondary-button" onClick={onClose}>HỦY</button><button type="submit" className="address-primary-button">LƯU ĐỊA CHỈ<IconArrowUpRight /></button></footer>
        </form>
      </section>
    </div>
  );
}

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState(null);

  const saveAddress = (values) => {
    const id = values.id ?? `address-${Date.now()}`;
    setAddresses((current) => {
      const next = current.map((address) => ({
        ...address,
        isDefault: address.id === id || values.isDefault ? false : address.isDefault,
      }));
      const savedAddress = { ...values, id, isDefault: values.isDefault || !next.some((address) => address.isDefault) };
      const existingIndex = next.findIndex((address) => address.id === id);
      if (existingIndex >= 0) next[existingIndex] = savedAddress;
      else next.push(savedAddress);
      return next;
    });
    setEditingAddress(null);
    setIsAdding(false);
  };

  const setDefault = (id) => setAddresses((current) => current.map((address) => ({ ...address, isDefault: address.id === id })));

  const deleteAddress = () => {
    setAddresses((current) => {
      const remaining = current.filter((address) => address.id !== deletingAddress.id);
      if (deletingAddress.isDefault && remaining.length) remaining[0] = { ...remaining[0], isDefault: true };
      return remaining;
    });
    setDeletingAddress(null);
  };

  return (
    <div className="address-page" data-node-id="20:3">
      <header className="cart-header address-header" data-node-id="20:4">
        <a className="cart-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="20:5"><img src={logo} alt="" data-node-id="20:6" /><span data-node-id="20:7">8ThreadTech</span></a>
        <nav className="cart-nav" aria-label="Danh mục" data-node-id="20:8"><a href="/">BÀN PHÍM</a><a href="/">KEYCAP</a><a href="/">PHỤ KIỆN</a><a href="/">VỀ 8THREADS TEAM</a></nav>
        <div className="cart-tools" data-node-id="16:1286"><button aria-label="Tìm kiếm" data-node-id="16:1287"><IconSearch /></button><a className="cart-bag" href="/gio-hang" aria-label="Giỏ hàng" data-node-id="16:1289"><IconShoppingBag data-node-id="16:1290" /><span data-node-id="16:1292">0</span></a><a href="/ho-so" aria-label="Tài khoản" data-node-id="16:1293"><IconUser /></a></div>
      </header>

      <main>
        <section className="address-intro" data-node-id="20:22">
          <div className="cart-breadcrumb" data-node-id="20:23"><a href="/">Trang chủ</a><IconChevronRight /><a href="/ho-so">Tài khoản</a><IconChevronRight /><span>Sổ địa chỉ</span></div>
          <div className="address-title-wrap" data-node-id="20:29"><div className="address-title"><div className="address-signature" data-node-id="20:30"><i data-node-id="20:31" /><span data-node-id="20:32">8THREADS - “FEEL” THEO TỪNG NHỊP GÕ CỦA BẠN.</span></div><h1 data-node-id="20:33">SỔ ĐỊA CHỈ</h1></div></div>
          <div className="address-intro-divider" data-node-id="20:34" />
        </section>

        <section className="address-content" data-node-id="20:35">
          <aside className="address-sidebar" data-node-id="20:36">
            <div className="address-identity" data-node-id="20:37"><div className="address-avatar" data-node-id="20:38"><span data-node-id="20:39">MA</span></div><div className="address-identity-copy" data-node-id="20:40"><strong data-node-id="20:41">Nguyễn Minh An</strong><span data-node-id="20:42">minhan@example.com</span></div><small data-node-id="20:43">TÀI KHOẢN NGƯỜI DÙNG</small></div>
            <div className="address-sidebar-rule" data-node-id="20:44" />
            <nav className="address-account-menu" aria-label="Điều hướng tài khoản" data-node-id="20:45">
              <a href="/ho-so" data-node-id="20:46"><IconUser data-node-id="20:47" /><span data-node-id="20:48">Hồ sơ cá nhân</span></a>
              <a href="/don-hang" data-node-id="20:49"><IconPackage data-node-id="20:50" /><span data-node-id="20:51">Đơn hàng của tôi</span></a>
              <a className="is-active" href="/so-dia-chi" aria-current="page" data-node-id="20:52"><IconMapPin data-node-id="20:53" /><span data-node-id="20:54">Sổ địa chỉ</span><IconChevronRight data-node-id="20:55" /></a>
              <a href="/ho-so" data-node-id="20:56"><IconLock data-node-id="20:57" /><span data-node-id="20:58">Đổi mật khẩu</span></a>
              <a href="/dang-nhap" data-node-id="20:59"><IconLogout data-node-id="20:60" /><span data-node-id="20:61">Đăng xuất</span></a>
            </nav>
            <div className="address-sidebar-rule address-help-rule" data-node-id="20:62" />
            <div className="address-help" data-node-id="20:63"><p data-node-id="20:64">Cần hỗ trợ về tài khoản của bạn?</p><a href="mailto:hello@8threadtech.vn" data-node-id="20:65"><span data-node-id="20:66">NHẮN TIN CHO 8THREADS</span><IconArrowUpRight data-node-id="20:67" /></a></div>
          </aside>

          <div className="address-main" data-node-id="20:68">
            <section className="address-panel" data-node-id="20:69">
              <div className="address-panel-heading" data-node-id="20:70"><div><h2 data-node-id="20:72">ĐỊA CHỈ GIAO HÀNG</h2><p data-node-id="20:73">Quản lý địa chỉ để mỗi lần đặt hàng nhanh chóng hơn.</p></div><button className="address-add-button" onClick={() => setIsAdding(true)} data-node-id="20:74"><IconPlus data-node-id="20:177" /><span data-node-id="20:76">THÊM ĐỊA CHỈ MỚI</span></button></div>
              <div className="address-panel-rule" data-node-id="20:77" />
              <div className="address-list-overview" data-node-id="20:78"><strong data-node-id="20:79">Địa chỉ đã lưu ({addresses.length})</strong><span data-node-id="20:80">Chỉ có một địa chỉ mặc định</span></div>
              {addresses.length ? <div className="address-list" data-node-id="20:81">
                {addresses.map((address) => (
                  <article className={`saved-address${address.isDefault ? " is-default" : ""}`} key={address.id}>
                    <div className="saved-address-top"><span className="saved-address-type">{address.label === "Văn phòng" ? <IconBuilding /> : <IconHome />}<strong>{address.label.toLocaleUpperCase("vi")}</strong></span>{address.isDefault && <span className="default-badge"><IconCircleCheck />Mặc định</span>}</div>
                    <div className="saved-address-recipient"><div><strong>{address.recipient}</strong><span className="recipient-separator">|</span><span>{address.phone}</span></div><p>{address.address}</p></div>
                    <div className="saved-address-rule" />
                    <div className="saved-address-actions">{address.isDefault ? <span className="default-note">Được chọn sẵn khi thanh toán.</span> : <button className="set-default-button" onClick={() => setDefault(address.id)}>Đặt làm mặc định</button>}<div className="saved-address-links"><button onClick={() => setEditingAddress(address)}><IconPencil />Chỉnh sửa</button><span aria-hidden="true">|</span><button className="delete-address-button" onClick={() => setDeletingAddress(address)}><IconTrash />Xóa</button></div></div>
                  </article>
                ))}
              </div> : <div className="address-empty"><IconMapPin /><h3>Chưa có địa chỉ giao hàng</h3><p>Thêm địa chỉ để hoàn tất đơn hàng nhanh chóng hơn.</p><button className="address-add-button" onClick={() => setIsAdding(true)}><IconPlus />THÊM ĐỊA CHỈ MỚI</button></div>}
            </section>
          </div>
        </section>
      </main>
      <CartFooter />

      {(isAdding || editingAddress) && <AddressForm key={editingAddress?.id ?? "new-address"} address={editingAddress} onClose={() => { setIsAdding(false); setEditingAddress(null); }} onSave={saveAddress} />}
      {deletingAddress && <div className="address-modal-backdrop"><section className="address-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-address-title"><span className="address-confirm-icon"><IconTrash /></span><h2 id="delete-address-title">XÓA ĐỊA CHỈ NÀY?</h2><p>Địa chỉ giao hàng sẽ bị xóa khỏi sổ địa chỉ của bạn.</p><div className="address-modal-actions"><button className="address-secondary-button" onClick={() => setDeletingAddress(null)}>GIỮ LẠI</button><button className="address-primary-button" onClick={deleteAddress}>XÓA ĐỊA CHỈ<IconTrash /></button></div></section></div>}
    </div>
  );
}
