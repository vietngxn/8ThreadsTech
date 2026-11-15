import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import './AdminProfile.css';

const defaults = {
  name: 'Minh Anh',
  email: 'minhanh@8threadtech.vn',
  phone: '',
  bio: 'Quản lý và vận hành cửa hàng 8ThreadTech.',
};
const storageKey = '8threadtech-admin-profile';

function readProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return saved && typeof saved === 'object' ? { ...defaults, ...saved } : defaults;
  } catch {
    return defaults;
  }
}

export default function AdminProfile() {
  const [savedProfile, setSavedProfile] = useState(readProfile);
  const [profile, setProfile] = useState(savedProfile);
  const [message, setMessage] = useState('');

  function update(event) {
    const { name, value } = event.target;
    setProfile(current => ({ ...current, [name]: value }));
    setMessage('');
  }

  function save(event) {
    event.preventDefault();
    try {
      localStorage.setItem(storageKey, JSON.stringify(profile));
      setSavedProfile(profile);
      setMessage('Thông tin hồ sơ đã được lưu trên trình duyệt này.');
    } catch {
      setMessage('Không thể lưu thông tin trên trình duyệt này.');
    }
  }

  function reset() {
    setProfile(savedProfile);
    setMessage('Đã hủy thay đổi.');
  }

  return (
    <div className="admin-profile-page" data-node-id="219:239">
      <AdminSidebar />
      <main className="admin-profile-main" data-node-id="219:298">
        <header className="admin-profile-topbar" data-node-id="219:299">
          <span>8ThreadTech</span><span className="admin-profile-slash">/</span><strong>Tài khoản / Sửa thông tin</strong>
        </header>
        <form className="admin-profile-content" onSubmit={save} data-node-id="219:303">
          <div className="admin-profile-heading" data-node-id="219:409">
            <div>
              <h1>Sửa thông tin quản trị viên</h1>
              <p>Cập nhật thông tin cá nhân và quản lý tài khoản của bạn.</p>
            </div>
            <Link to="/admin" className="admin-profile-back" data-node-id="219:420"><IconArrowLeft size={14} />Quay lại</Link>
          </div>

          <div className="admin-profile-grid" data-node-id="219:410">
            <section className="admin-profile-card admin-personal-card" data-node-id="219:411">
              <div className="admin-profile-section-heading" data-node-id="219:422">
                <h2>Thông tin cá nhân</h2>
                <p>Thông tin này giúp nhận diện bạn trong hệ thống quản trị.</p>
              </div>
              <label className="admin-profile-field" data-node-id="219:425">
                <span>Họ và tên <b>*</b></span>
                <input name="name" value={profile.name} onChange={update} required autoComplete="name" data-node-id="219:427" />
              </label>
              <label className="admin-profile-field admin-profile-email" data-node-id="219:429">
                <span>Email <b>*</b></span>
                <input name="email" type="email" value={profile.email} onChange={update} required autoComplete="email" data-node-id="219:431" />
                <small>Được sử dụng để đăng nhập và nhận thông báo tài khoản.</small>
              </label>
              <label className="admin-profile-field" data-node-id="219:434">
                <span>Số điện thoại</span>
                <input name="phone" type="tel" value={profile.phone} onChange={update} autoComplete="tel" placeholder="Nhập số điện thoại liên hệ" data-node-id="219:436" />
              </label>
              <label className="admin-profile-field admin-profile-bio" data-node-id="219:438">
                <span>Giới thiệu</span>
                <textarea name="bio" value={profile.bio} onChange={update} rows="3" data-node-id="219:440" />
                <small>Mô tả ngắn về vai trò của bạn trong cửa hàng.</small>
              </label>
              <p className="admin-profile-required">* Thông tin bắt buộc</p>
            </section>

            <div className="admin-profile-side-stack" data-node-id="219:412">
              <section className="admin-profile-card admin-account-card" data-node-id="219:413">
                <div className="admin-profile-section-heading" data-node-id="219:444">
                  <h2>Thông tin tài khoản</h2>
                  <p>Thông tin đăng nhập và quyền truy cập.</p>
                </div>
                <div className="admin-profile-readonly-field" data-node-id="219:447">
                  <span>Tên đăng nhập</span>
                  <div><span>minhanh</span><small>Chỉ xem</small></div>
                </div>
                <div className="admin-profile-readonly-field" data-node-id="219:452">
                  <span>Vai trò</span>
                  <div><span>Quản trị viên</span><small>Chỉ xem</small></div>
                </div>
                <div className="admin-profile-status" data-node-id="219:457">
                  <span>Trạng thái</span><strong>● &nbsp;Đang hoạt động</strong>
                </div>
                <p className="admin-profile-note">Tên đăng nhập và vai trò không thể thay đổi tại đây. Liên hệ quản trị hệ thống nếu cần hỗ trợ.</p>
              </section>

              <section className="admin-profile-card admin-security-card" data-node-id="219:414">
                <h2>Bảo mật tài khoản</h2>
                <p>Mật khẩu được quản lý riêng để bảo vệ tài khoản của bạn.</p>
                <Link to="/doi-mat-khau">Đổi mật khẩu</Link>
              </section>
            </div>
          </div>

          <div className="admin-profile-save-bar" data-node-id="219:415">
            <div>
              <strong>Kiểm tra thông tin trước khi lưu</strong>
              <p>Các thay đổi chỉ có hiệu lực sau khi bạn nhấn Lưu thay đổi.</p>
            </div>
            <div className="admin-profile-actions" data-node-id="219:469">
              <button type="button" onClick={reset} data-node-id="219:470">Hủy thay đổi</button>
              <button type="submit" data-node-id="219:472">Lưu thay đổi</button>
            </div>
          </div>
          <p className="admin-profile-feedback" role="status" aria-live="polite">{message}</p>
          <footer className="admin-profile-footer" data-node-id="219:416">
            <span>8ThreadTech · Tài khoản quản trị viên</span>
            <span>Mọi thay đổi được ghi nhận trong nhật kí hệ thống.</span>
          </footer>
        </form>
      </main>
    </div>
  );
}
