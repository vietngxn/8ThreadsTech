import { useState } from 'react';
import { IconLogout } from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import { authService } from '../../services/authService.js';
import './AdminSettings.css';

const defaults = { orders: true, inventory: true, report: false };
const storageKey = '8threadtech-admin-settings';

function readSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return saved && typeof saved === 'object' ? { ...defaults, ...saved } : defaults;
  } catch {
    return defaults;
  }
}

const notifications = [
  { key: 'orders', title: 'Đơn hàng mới', description: 'Gửi email khi có đơn hàng mới.', node: '216:437' },
  { key: 'inventory', title: 'Cảnh báo tồn kho', description: 'Thông báo khi còn dưới 5 sản phẩm.', node: '216:443' },
  { key: 'report', title: 'Báo cáo hằng ngày', description: 'Gửi tổng kết kinh doanh lúc 22:00.', node: '216:449' },
];

export default function AdminSettings() {
  const [saved, setSaved] = useState(readSettings);
  const [settings, setSettings] = useState(saved);
  const [message, setMessage] = useState('');

  function change(key, value) {
    setSettings(current => ({ ...current, [key]: value }));
    setMessage('');
  }

  function save(event) {
    event.preventDefault();
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setSaved(settings);
      setMessage('Đã lưu cài đặt trên trình duyệt này.');
    } catch {
      setMessage('Không thể lưu cài đặt trên trình duyệt này.');
    }
  }

  return <div className="settings-dashboard" data-node-id="216:2">
    <AdminSidebar />
    <main className="settings-main" data-node-id="216:61">
      <header className="settings-topbar" data-node-id="216:62"><span>8ThreadTech</span><span>/</span><strong>Cài đặt</strong></header>
      <form className="settings-content" onSubmit={save} data-node-id="216:66">
        <div className="settings-heading" data-node-id="216:347">
          <div><h1>Cài đặt</h1><p>Tùy chỉnh thông báo và phiên đăng nhập của cửa hàng.</p></div>
          <span>Chỉ dành cho quản trị viên</span>
        </div>
        <section className="settings-panel settings-notifications" data-node-id="216:354">
          <h2>Thông báo</h2><p>Chọn những cập nhật bạn muốn nhận.</p>
          <div className="settings-notification-list">{notifications.map(item => <div className="settings-notification" key={item.key} data-node-id={item.node}>
            <div><strong>{item.title}</strong><p>{item.description}</p></div>
            <button type="button" role="switch" aria-label={item.title} aria-checked={settings[item.key]} className={`settings-switch ${settings[item.key] ? 'on' : ''}`} onClick={() => change(item.key, !settings[item.key])}><span /></button>
          </div>)}</div>
        </section>

        <section className="settings-panel settings-account-logout">
          <h2>Tài khoản &amp; Phiên đăng nhập</h2>
          <p>Quản lý phiên làm việc quản trị viên trên trình duyệt này.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--admin-border, #27272a)' }}>
            <div>
              <strong>Đăng xuất tài khoản quản trị</strong>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#a1a1aa' }}>Kết thúc phiên đăng nhập và xóa token truy cập an toàn.</p>
            </div>
            <button
              type="button"
              onClick={() => authService.logout("/dang-nhap")}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <IconLogout size={16} />
              Đăng xuất
            </button>
          </div>
        </section>
        <div className="settings-save-bar" data-node-id="216:357">
          <div><strong>Cài đặt trên trình duyệt</strong><p>Bản xem trước, chưa áp dụng cho cửa hàng hoặc gửi thông báo.</p></div>
          <div className="settings-actions"><button type="button" onClick={() => { setSettings(saved); setMessage('Đã hủy thay đổi.'); }}>Hủy thay đổi</button><button type="submit">Lưu thay đổi</button></div>
        </div>
        <div className="settings-footer" data-node-id="216:358"><span>8ThreadTech · Cài đặt hệ thống</span><span>Thiết lập được lưu trên trình duyệt này.</span></div>
        <div className="settings-feedback" role="status" aria-live="polite">{message}</div>
      </form>
    </main>
  </div>;
}
