import { useState, useEffect } from "react";
import { IconArrowUpRight, IconX, IconCheck } from "@tabler/icons-react";

const emptyForm = { label: "Nhà riêng", recipient: "", phone: "", address: "", isDefault: false };

export default function AddressForm({ address, onClose, onSave }) {
  const [form, setForm] = useState(address ? { ...address } : emptyForm);
  
  useEffect(() => {
    if (address) {
      setForm({ ...address });
    } else {
      setForm(emptyForm);
    }
  }, [address]);

  const update = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div className="address-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="address-modal" role="dialog" aria-modal="true" aria-labelledby="address-modal-title">
        <header className="address-modal-heading">
          <div>
            <span>THÔNG TIN GIAO HÀNG</span>
            <h2 id="address-modal-title">{address ? "CHỈNH SỬA ĐỊA CHỈ" : "THÊM ĐỊA CHỈ MỚI"}</h2>
          </div>
          <button type="button" className="address-icon-button" onClick={onClose} aria-label="Đóng"><IconX /></button>
        </header>
        <form onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
          <label className="address-form-field">
            Tên gợi nhớ
            <select name="label" value={form.label} onChange={update}>
              <option>Nhà riêng</option>
              <option>Văn phòng</option>
              <option>Khác</option>
            </select>
          </label>
          <label className="address-form-field">
            Họ và tên người nhận
            <input name="recipient" value={form.recipient} onChange={update} required autoComplete="name" />
          </label>
          <label className="address-form-field">
            Số điện thoại
            <input name="phone" type="tel" value={form.phone} onChange={update} required autoComplete="tel" />
          </label>
          <label className="address-form-field">
            Địa chỉ giao hàng
            <textarea name="address" value={form.address} onChange={update} rows="3" required autoComplete="street-address" />
          </label>
          <label className="address-default-option">
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={update} />
            <span><IconCheck /></span>Đặt làm địa chỉ mặc định
          </label>
          <footer className="address-modal-actions">
            <button type="button" className="address-secondary-button" onClick={onClose}>HỦY</button>
            <button type="submit" className="address-primary-button">LƯU ĐỊA CHỈ<IconArrowUpRight /></button>
          </footer>
        </form>
      </section>
    </div>
  );
}