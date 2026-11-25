import { useState, useEffect } from "react";
import { IconArrowUpRight, IconX, IconCheck } from "@tabler/icons-react";

const emptyForm = { label: "Nhà riêng", recipient: "", phone: "", address: "", isDefault: false };

export default function AddressForm({ address, onClose, onSave }) {
  const [form, setForm] = useState(address ? { ...address } : emptyForm);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (address) {
      setForm({ ...address });
    } else {
      setForm(emptyForm);
    }
  }, [address]);

  const update = (event) => {
    const { name, value, checked, type } = event.target;
    if (name === "phone") {
      // Chỉ cho phép nhập ký tự số, tối đa 11 chữ số
      const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
      setForm((current) => ({ ...current, phone: digitsOnly }));
      return;
    }
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePhoneKeyDown = (e) => {
    // Cho phép các phím điều hướng và chỉnh sửa
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
      "Home",
      "End",
    ];
    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
      return;
    }
    // Chặn nếu không phải là ký tự số 0-9
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!form.phone || form.phone.length < 9) {
      alert("Vui lòng nhập số điện thoại hợp lệ (từ 9 đến 11 số)");
      return;
    }

    setSubmitting(true);
    try {
      await onSave(form);
    } catch {
      // Lỗi đã được xử lý hoặc hiển thị
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="address-modal-backdrop" onMouseDown={(event) => !submitting && event.target === event.currentTarget && onClose()}>
      <section className="address-modal" role="dialog" aria-modal="true" aria-labelledby="address-modal-title">
        <header className="address-modal-heading">
          <div>
            <span>THÔNG TIN GIAO HÀNG</span>
            <h2 id="address-modal-title">{address ? "CHỈNH SỬA ĐỊA CHỈ" : "THÊM ĐỊA CHỈ MỚI"}</h2>
          </div>
          <button type="button" className="address-icon-button" onClick={onClose} aria-label="Đóng" disabled={submitting}><IconX /></button>
        </header>
        <form onSubmit={handleSubmit}>
          <label className="address-form-field">
            Tên gợi nhớ
            <select name="label" value={form.label} onChange={update} disabled={submitting}>
              <option>Nhà riêng</option>
              <option>Văn phòng</option>
              <option>Khác</option>
            </select>
          </label>
          <label className="address-form-field">
            Họ và tên người nhận
            <input
              name="recipient"
              value={form.recipient}
              onChange={update}
              required
              autoComplete="name"
              disabled={submitting}
            />
          </label>
          <label className="address-form-field">
            Số điện thoại
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={form.phone}
              onChange={update}
              onKeyDown={handlePhoneKeyDown}
              placeholder="VD: 0912345678 (chỉ nhập số)"
              maxLength={11}
              required
              autoComplete="tel"
              disabled={submitting}
            />
          </label>
          <label className="address-form-field">
            Địa chỉ giao hàng
            <textarea
              name="address"
              value={form.address}
              onChange={update}
              rows="3"
              required
              autoComplete="street-address"
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              disabled={submitting}
            />
          </label>
          <label className="address-default-option">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={update}
              disabled={submitting}
            />
            <span><IconCheck /></span>Đặt làm địa chỉ mặc định
          </label>
          <footer className="address-modal-actions">
            <button type="button" className="address-secondary-button" onClick={onClose} disabled={submitting}>HỦY</button>
            <button type="submit" className="address-primary-button" disabled={submitting}>
              {submitting ? "ĐANG LƯU..." : "LƯU ĐỊA CHỈ"}
              <IconArrowUpRight />
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
