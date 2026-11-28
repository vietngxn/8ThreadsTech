import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import { authService } from '../../services/authService.js';
import { userService } from '../../services/userService.js';
import './AdminProfile.css';

const GENDER_OPTIONS = ['Nam', 'Nữ', 'Khác', 'Không muốn tiết lộ'];

function mapUserToProfile(user) {
  return {
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : '',
    gender: user?.gender || 'Nam',
    receiveNewsletter: Boolean(user?.receiveNewsletter),
    status: user?.status || 'ACTIVE',
    emailVerifiedAt: user?.emailVerifiedAt || null,
  };
}

function getInitialProfile() {
  return mapUserToProfile(authService.getCurrentUser());
}

export default function AdminProfile() {
  const [savedProfile, setSavedProfile] = useState(getInitialProfile);
  const [profile, setProfile] = useState(getInitialProfile);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    const token = authService.getToken();
    if (!token) return;

    let cancelled = false;
    setLoading(true);

    userService
      .getMyProfile()
      .then((data) => {
        if (cancelled || !data) return;
        const mapped = mapUserToProfile(data);
        setProfile(mapped);
        setSavedProfile(mapped);

        const currentStored = authService.getCurrentUser() || {};
        localStorage.setItem('currentUser', JSON.stringify({ ...currentStored, ...data }));
        window.dispatchEvent(new Event('auth:state-change'));
      })
      .catch((err) => {
        if (!cancelled) {
          setFeedback({
            type: 'error',
            text: err?.message || 'Không thể tải thông tin quản trị viên từ máy chủ.',
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function update(event) {
    const { name, value, type, checked } = event.target;
    setProfile((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (feedback.text) {
      setFeedback({ type: '', text: '' });
    }
  }

  async function save(event) {
    event.preventDefault();
    const trimmedName = profile.fullName.trim();
    if (!trimmedName) {
      setFeedback({ type: 'error', text: 'Vui lòng nhập họ và tên.' });
      return;
    }

    setSaving(true);
    setFeedback({ type: '', text: '' });

    try {
      const payload = {
        fullName: trimmedName,
        phone: profile.phone.trim(),
        gender: profile.gender,
        receiveNewsletter: profile.receiveNewsletter,
      };
      if (profile.dateOfBirth && /^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth.trim())) {
        payload.dateOfBirth = profile.dateOfBirth.trim();
      }

      const updatedData = await userService.updateProfile(payload);
      const nextProfile = updatedData
        ? mapUserToProfile(updatedData)
        : { ...profile, fullName: trimmedName, phone: profile.phone.trim() };

      setProfile(nextProfile);
      setSavedProfile(nextProfile);

      const currentStored = authService.getCurrentUser() || {};
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          ...currentStored,
          ...(updatedData || payload),
        })
      );
      window.dispatchEvent(new Event('auth:state-change'));

      setFeedback({ type: 'success', text: 'Cập nhật thông tin quản trị viên thành công.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Không thể cập nhật thông tin quản trị viên.',
      });
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setProfile(savedProfile);
    setFeedback({ type: '', text: 'Đã hủy thay đổi.' });
  }

  const isLocked = profile.status === 'LOCKED';

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
                <p>Thông tin này được đồng bộ trực tiếp với tài khoản của bạn trong hệ thống.</p>
              </div>

              <label className="admin-profile-field" data-node-id="219:425">
                <span>Họ và tên <b>*</b></span>
                <input
                  name="fullName"
                  value={profile.fullName}
                  onChange={update}
                  required
                  disabled={loading || saving}
                  autoComplete="name"
                  placeholder="Nhập họ và tên"
                  data-node-id="219:427"
                />
              </label>

              <label className="admin-profile-field admin-profile-email" data-node-id="219:429">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  readOnly
                  disabled
                  autoComplete="email"
                  data-node-id="219:431"
                />
                <small>Email đăng nhập được quản lý bởi hệ thống và không thể thay đổi tại đây.</small>
              </label>

              <div className="admin-profile-row">
                <label className="admin-profile-field" data-node-id="219:434">
                  <span>Số điện thoại</span>
                  <input
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={update}
                    disabled={loading || saving}
                    autoComplete="tel"
                    placeholder="Nhập số điện thoại liên hệ"
                    data-node-id="219:436"
                  />
                </label>

                <label className="admin-profile-field">
                  <span>Ngày sinh</span>
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={update}
                    disabled={loading || saving}
                  />
                </label>
              </div>

              <fieldset className="admin-profile-gender" disabled={loading || saving}>
                <legend>Giới tính</legend>
                <div className="admin-profile-gender-options">
                  {GENDER_OPTIONS.map((option) => (
                    <label key={option} className={profile.gender === option ? 'selected' : ''}>
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={profile.gender === option}
                        onChange={update}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="admin-profile-newsletter">
                <input
                  type="checkbox"
                  name="receiveNewsletter"
                  checked={profile.receiveNewsletter}
                  onChange={update}
                  disabled={loading || saving}
                />
                <span className="admin-profile-checkmark"><IconCheck size={12} stroke={2.5} /></span>
                <span>
                  <strong>Nhận bản tin &amp; thông báo ưu đãi qua email</strong>
                  <small>Đồng bộ với tùy chọn nhận tin của tài khoản.</small>
                </span>
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
                  <span>Email đăng nhập</span>
                  <div><span>{profile.email || '—'}</span><small>Chỉ xem</small></div>
                </div>
                <div className="admin-profile-readonly-field" data-node-id="219:452">
                  <span>Vai trò</span>
                  <div><span>Quản trị viên</span><small>Chỉ xem</small></div>
                </div>
                <div className="admin-profile-status" data-node-id="219:457">
                  <span>Trạng thái</span>
                  <strong className={isLocked ? 'is-locked' : ''}>
                    ● &nbsp;{isLocked ? 'Đã khóa' : 'Đang hoạt động'}
                  </strong>
                </div>
                <div className="admin-profile-status">
                  <span>Xác minh email</span>
                  <strong className={profile.emailVerifiedAt ? '' : 'is-unverified'}>
                    {profile.emailVerifiedAt ? 'Đã xác minh' : 'Chưa xác minh'}
                  </strong>
                </div>
                <p className="admin-profile-note">Email đăng nhập và vai trò không thể thay đổi tại đây. Liên hệ quản trị hệ thống nếu cần hỗ trợ.</p>
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
              <button type="button" onClick={reset} disabled={loading || saving} data-node-id="219:470">Hủy thay đổi</button>
              <button type="submit" disabled={loading || saving} data-node-id="219:472">
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
          <p className={`admin-profile-feedback ${feedback.type ? `is-${feedback.type}` : ''}`} role="status" aria-live="polite">
            {feedback.text}
          </p>
          <footer className="admin-profile-footer" data-node-id="219:416">
            <span>8ThreadTech · Tài khoản quản trị viên</span>
            <span>Mọi thay đổi được ghi nhận trong nhật kí hệ thống.</span>
          </footer>
        </form>
      </main>
    </div>
  );
}
