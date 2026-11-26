import { IconArrowLeft, IconTruck, IconQrcode, IconCreditCard } from "@tabler/icons-react";

const formatPrice = (price) => `${Number(price || 0).toLocaleString("vi-VN")} ₫`;

const PAYMENT_ICONS = { COD: IconTruck, VNPAY: IconQrcode, MOMO: IconCreditCard };

function CheckoutField({ label, children, className = "" }) {
  return <label className={`checkout-field ${className}`}><span>{label}</span>{children}</label>;
}

function CheckoutSection({ number, title, children, note }) {
  return (
    <section className="checkout-section">
      <div className="checkout-section-heading">
        <span className="checkout-section-number">{number}</span>
        <h2>{title}</h2>
        {note && <span className="checkout-section-note">{note}</span>}
      </div>
      {children}
    </section>
  );
}

function ChoiceCard({ name, value, selected, onChange, title, description, icon: Icon, price, disabled = false }) {
  return (
    <label
      className={`checkout-choice${selected ? " is-selected" : ""}`}
      style={disabled ? { opacity: 0.55, cursor: "not-allowed" } : undefined}
    >
      <input type="radio" name={name} value={value} checked={selected} onChange={onChange} disabled={disabled} />
      <span className="checkout-radio" aria-hidden="true" />
      <span className="checkout-choice-copy"><strong>{title}</strong><span>{description}</span></span>
      {Icon && <Icon className="checkout-choice-icon" aria-hidden="true" />}
      {price && <span className={`checkout-choice-price${selected ? " is-selected" : ""}`}>{price}</span>}
    </label>
  );
}

export default function CheckoutForm({
  form,
  onFieldChange,
  addresses = [],
  selectedAddressId = "",
  onSelectAddress,
  shippingMethods = [],
  shippingLoaded = false,
  shipping,
  onShippingChange,
  payment,
  paymentMethods = [],
  onPaymentChange,
}) {
  const bind = (name) => ({
    name,
    value: form[name] ?? "",
    onChange: (event) => onFieldChange(name, event.target.value),
  });

  return (
    <div className="checkout-form-column">
      <CheckoutSection number="01" title="THÔNG TIN LIÊN HỆ" note="* Thông tin bắt buộc">
        <div className="checkout-field-grid">
          <CheckoutField label="Họ và tên *">
            <input {...bind("customerName")} autoComplete="name" placeholder="Nhập họ và tên người nhận" maxLength={150} required />
          </CheckoutField>
          <CheckoutField label="Số điện thoại *">
            <input {...bind("customerPhone")} type="tel" autoComplete="tel" placeholder="Nhập số điện thoại" pattern="[0-9+()\-\s.]{8,20}" title="Số điện thoại từ 8 đến 20 ký tự" required />
          </CheckoutField>
          <CheckoutField label="Email *" className="checkout-field-wide">
            <input {...bind("customerEmail")} type="email" autoComplete="email" placeholder="Nhập email của bạn" maxLength={190} required />
          </CheckoutField>
        </div>
      </CheckoutSection>

      <CheckoutSection
        number="02"
        title="ĐỊA CHỈ NHẬN HÀNG"
        note={
          addresses.length > 0 ? (
            <select
              className="checkout-address-note"
              aria-label="Chọn từ sổ địa chỉ"
              style={{ background: "transparent", border: "none", maxWidth: 280, cursor: "pointer" }}
              value={selectedAddressId}
              onChange={(event) => onSelectAddress?.(event.target.value)}
            >
              <option value="">Nhập địa chỉ mới</option>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.receiverName} · {address.fullAddress || address.addressLine}
                </option>
              ))}
            </select>
          ) : (
            <a className="checkout-address-note" href="/so-dia-chi">Thêm vào sổ địa chỉ</a>
          )
        }
      >
        <div className="checkout-field-grid">
          <CheckoutField label="Tỉnh / Thành phố *">
            <input {...bind("province")} autoComplete="address-level1" placeholder="Ví dụ: Thành phố Hồ Chí Minh" maxLength={120} required />
          </CheckoutField>
          <CheckoutField label="Quận / Huyện *">
            <input {...bind("district")} autoComplete="address-level2" placeholder="Ví dụ: Thành phố Thủ Đức" maxLength={120} required />
          </CheckoutField>
          <CheckoutField label="Phường / Xã *">
            <input {...bind("ward")} placeholder="Ví dụ: Phường Linh Trung" maxLength={120} required />
          </CheckoutField>
          <CheckoutField label="Địa chỉ cụ thể *" className="checkout-field-wide">
            <input {...bind("addressLine")} autoComplete="street-address" placeholder="Số nhà, tên đường, tòa nhà / căn hộ" maxLength={255} required />
          </CheckoutField>
        </div>
      </CheckoutSection>

      <CheckoutSection number="03" title="PHƯƠNG THỨC GIAO HÀNG">
        <div className="checkout-choice-list">
          {!shippingLoaded && <p>Đang tải phương thức giao hàng...</p>}
          {shippingLoaded && shippingMethods.length === 0 && (
            <p role="alert">Hiện chưa có phương thức giao hàng khả dụng. Vui lòng thử lại sau.</p>
          )}
          {shippingMethods.map((method) => (
            <ChoiceCard
              key={method.code}
              name="shipping"
              value={method.code}
              selected={shipping === method.code}
              onChange={() => onShippingChange(method.code)}
              title={method.name}
              description={method.description}
              price={Number(method.baseCost) === 0 ? "Miễn phí" : formatPrice(method.baseCost)}
            />
          ))}
        </div>
      </CheckoutSection>

      <CheckoutSection number="04" title="PHƯƠNG THỨC THANH TOÁN">
        <div className="checkout-choice-list">
          {paymentMethods.map((method) => (
            <ChoiceCard
              key={method.code}
              name="payment"
              value={method.code}
              selected={payment === method.code}
              onChange={() => onPaymentChange(method.code)}
              title={method.name}
              description={method.description}
              icon={PAYMENT_ICONS[method.code]}
              disabled={!method.enabled}
              price={method.enabled ? undefined : "Tạm ngưng"}
            />
          ))}
        </div>
      </CheckoutSection>

      <CheckoutSection number="05" title="GHI CHÚ ĐƠN HÀNG" note="Không bắt buộc">
        <textarea {...bind("customerNote")} rows="3" maxLength={1000} placeholder="Ghi chú cho 8Threads về đơn hàng hoặc hướng dẫn giao hàng..." />
      </CheckoutSection>

      <a className="checkout-back" href="/gio-hang">
        <IconArrowLeft /> QUAY VỀ GIỎ HÀNG
      </a>
    </div>
  );
}
