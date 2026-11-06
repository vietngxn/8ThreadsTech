import { IconArrowUpRight, IconCalendar, IconCheck, IconChevronRight, IconLock, IconShieldCheck } from "@tabler/icons-react";

export default function ProfileForm({ profile, onUpdate, onReset, saved }) {
  return (
    <div className="profile-main" data-node-id="8:880">
      <form className="profile-card" id="profile" onSubmit={(event) => { event.preventDefault(); }} data-node-id="8:881">
        <div className="profile-card-heading" data-node-id="8:882">
          <div>
            <h2 data-node-id="8:884">THÔNG TIN CÁ NHÂN</h2>
            <p data-node-id="8:885">Cập nhật thông tin để 8ThreadTech phục vụ bạn tốt hơn.</p>
          </div>
          <span className="required-note" data-node-id="8:887">* Thông tin bắt buộc</span>
        </div>
        <div className="profile-rule" data-node-id="8:888" />
        <div className="profile-fields" data-node-id="8:889">
          <label className="profile-field" data-node-id="8:891">
            <span data-node-id="8:892">Họ và tên <b>*</b></span>
            <input name="name" value={profile.name} onChange={onUpdate} required autoComplete="name" data-node-id="8:893" />
          </label>
          <label className="profile-field" data-node-id="8:895">
            <span data-node-id="8:896">Email <b>*</b></span>
            <input name="email" type="email" value={profile.email} onChange={onUpdate} required autoComplete="email" data-node-id="8:897" />
          </label>
          <label className="profile-field" data-node-id="8:900">
            <span data-node-id="8:901">Số điện thoại <b>*</b></span>
            <input name="phone" type="tel" value={profile.phone} onChange={onUpdate} required autoComplete="tel" data-node-id="8:902" />
          </label>
          <label className="profile-field" data-node-id="8:904">
            <span data-node-id="8:905">Ngày sinh</span>
            <span className="profile-input-with-icon" data-node-id="8:906">
              <input name="birthday" value={profile.birthday} onChange={onUpdate} data-node-id="8:907" />
              <IconCalendar data-node-id="8:1038" />
            </span>
          </label>
          <fieldset className="profile-gender" data-node-id="8:909">
            <legend data-node-id="8:910">Giới tính <span>(không bắt buộc)</span></legend>
            <div data-node-id="8:911">
              {["Nam", "Nữ", "Khác", "Không muốn tiết lộ"].map((gender) => (
                <label key={gender} className={profile.gender === gender ? "selected" : ""}>
                  <input type="radio" name="gender" value={gender} checked={profile.gender === gender} onChange={onUpdate} />
                  <span>{gender}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="profile-rule profile-options-rule" data-node-id="8:925" />
        <label className="profile-newsletter" data-node-id="8:926">
          <input type="checkbox" name="newsletter" checked={profile.newsletter} onChange={onUpdate} data-node-id="8:927" />
          <span className="profile-checkmark"><IconCheck data-node-id="8:1041" /></span>
          <span className="profile-newsletter-copy" data-node-id="8:929">
            <strong data-node-id="8:930">Nhận tin về sản phẩm mới và ưu đãi từ 8ThreadTech qua email</strong>
            <small data-node-id="8:931">Bạn có thể thay đổi lựa chọn này bất cứ lúc nào.</small>
          </span>
        </label>
        <div className="profile-actions" data-node-id="8:932">
          <p className="profile-privacy" data-node-id="8:933"><IconShieldCheck data-node-id="8:1044" />Thông tin cá nhân của bạn được bảo mật.</p>
          <div className="profile-action-buttons" data-node-id="8:936">
            <button type="button" className="profile-cancel" onClick={onReset} data-node-id="8:937">Hủy thay đổi</button>
            <button type="submit" className="profile-save" data-node-id="8:939">LƯU THAY ĐỔI<IconArrowUpRight data-node-id="8:941" /></button>
          </div>
        </div>
        {saved && <p className="profile-saved" role="status">Thông tin hồ sơ đã được cập nhật.</p>}
      </form>
    </div>
  );
}