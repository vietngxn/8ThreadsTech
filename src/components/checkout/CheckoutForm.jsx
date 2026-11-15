import { IconArrowLeft, IconTruck, IconQrcode, IconCreditCard } from "@tabler/icons-react";

const paymentMethods = [
  { id: "cod", title: "Thanh toán khi nhận hàng (COD)", description: "Thanh toán cho đơn vị vận chuyển khi nhận sản phẩm.", icon: IconTruck },
  { id: "vnpay", title: "Chuyển khoản ngân hàng / VNPAY", description: "Thanh toán an toàn qua cổng thanh toán trực tuyến.", icon: IconQrcode },
  { id: "momo", title: "Ví điện tử / MOMO", description: "Thanh toán an toàn qua cổng thanh toán trực tuyến.", icon: IconCreditCard },
];

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

function ChoiceCard({ name, value, selected, onChange, title, description, icon: Icon, price }) {
  return (
    <label className={`checkout-choice${selected ? " is-selected" : ""}`}>
      <input type="radio" name={name} value={value} checked={selected} onChange={onChange} />
      <span className="checkout-radio" aria-hidden="true" />
      <span className="checkout-choice-copy"><strong>{title}</strong><span>{description}</span></span>
      {Icon && <Icon className="checkout-choice-icon" aria-hidden="true" />}
      {price && <span className={`checkout-choice-price${selected ? " is-selected" : ""}`}>{price}</span>}
    </label>
  );
}

export default function CheckoutForm({ shipping, payment, onShippingChange, onPaymentChange }) {
  return (
    <div className="checkout-form-column">
      <CheckoutSection number="01" title="THÔNG TIN LIÊN HỆ" note="* Thông tin bắt buộc">
        <div className="checkout-field-grid">
          <CheckoutField label="Họ và tên *">
            <input name="fullName" autoComplete="name" placeholder="Nhập họ và tên người nhận" required />
          </CheckoutField>
          <CheckoutField label="Số điện thoại *">
            <input name="phone" type="tel" autoComplete="tel" placeholder="Nhập số điện thoại" required />
          </CheckoutField>
          <CheckoutField label="Email *" className="checkout-field-wide">
            <input name="email" type="email" autoComplete="email" placeholder="Nhập email để nhận xác nhận đơn hàng" required />
          </CheckoutField>
        </div>
      </CheckoutSection>

      <CheckoutSection number="02" title="ĐỊA CHỈ NHẬN HÀNG" note={<span className="checkout-address-note">Chọn từ sổ địa chỉ</span>}>
        <div className="checkout-field-grid">
          <CheckoutField label="Tỉnh / Thành phố *">
            <select name="city" defaultValue="" required>
              <option value="" disabled>Chọn tỉnh / thành phố</option>
              <option>Hà Nội</option>
              <option>Thành phố Hồ Chí Minh</option>
              <option>Đà Nẵng</option>
              <option>Cần Thơ</option>
            </select>
          </CheckoutField>
          <CheckoutField label="Phường / Xã *">
            <select name="ward" defaultValue="" required>
              <option value="" disabled>Chọn phường / xã</option>
              <option>Phường 1</option>
              <option>Phường 2</option>
              <option>Phường 3</option>
              <option>Phường trung tâm</option>
            </select>
          </CheckoutField>
          <CheckoutField label="Địa chỉ cụ thể *" className="checkout-field-wide">
            <input name="address" autoComplete="street-address" placeholder="Số nhà, tên đường, tòa nhà / căn hộ" required />
          </CheckoutField>
        </div>
      </CheckoutSection>

      <CheckoutSection number="03" title="PHƯƠNG THỨC GIAO HÀNG">
        <div className="checkout-choice-list">
          <ChoiceCard 
            name="shipping" 
            value="standard" 
            selected={shipping === "standard"} 
            onChange={() => onShippingChange("standard")} 
            title="Giao hàng tiêu chuẩn" 
            description="Dự kiến 2–5 ngày làm việc kể từ khi xác nhận đơn hàng." 
            price="Miễn phí" 
          />
          <ChoiceCard 
            name="shipping" 
            value="express" 
            selected={shipping === "express"} 
            onChange={() => onShippingChange("express")} 
            title="Hỏa tốc" 
            description="Trong vòng 24h. Áp dụng tại khu vực hỗ trợ." 
            price="35.000 ₫" 
          />
        </div>
      </CheckoutSection>

      <CheckoutSection number="04" title="PHƯƠNG THỨC THANH TOÁN">
        <div className="checkout-choice-list">
          {paymentMethods.map((method) => (
            <ChoiceCard 
              key={method.id} 
              name="payment" 
              value={method.id} 
              selected={payment === method.id} 
              onChange={() => onPaymentChange(method.id)} 
              title={method.title} 
              description={method.description} 
              icon={method.icon} 
            />
          ))}
        </div>
      </CheckoutSection>

      <CheckoutSection number="05" title="GHI CHÚ ĐƠN HÀNG" note="Không bắt buộc">
        <textarea name="note" rows="3" placeholder="Ghi chú cho 8Threads về đơn hàng hoặc hướng dẫn giao hàng..." />
      </CheckoutSection>

      <a className="checkout-back" href="/gio-hang">
        <IconArrowLeft /> QUAY VỀ GIỎ HÀNG
      </a>
    </div>
  );
}
