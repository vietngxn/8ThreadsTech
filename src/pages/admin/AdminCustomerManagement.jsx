import { useEffect, useRef, useMemo, useState } from 'react';
import {
  IconCalendar, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconColumns3, IconCrown, IconDots, IconDownload, IconEye,
  IconLock, IconLockOpen, IconRepeat, IconSearch,
  IconUserPlus, IconUsers, IconX,
} from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import './AdminOrderManagement.css';
import './AdminCustomerManagement.css';

/* ── Mock data theo schema DB ── */
const customers = [
  {
    id: 1, numericId: '#KH-0248',
    fullName: 'Nguyễn Hoàng Nam', email: 'hoangnam.ng@gmail.com',
    phone: '0901234567', dateOfBirth: '1995-03-14', gender: 'Nam',
    receiveNewsletter: true, status: 'ACTIVE', emailVerifiedAt: '2026-01-05 08:12:00',
    lockedReason: null,
    orders: 8, spend: 15680000, lastPurchase: '25/10/2026', lastOrder: '#8TT-1024',
  },
  {
    id: 2, numericId: '#KH-0247',
    fullName: 'Trần Minh Thư', email: 'minhthu.tran@gmail.com',
    phone: '0938456789', dateOfBirth: '1998-07-22', gender: 'Nữ',
    receiveNewsletter: false, status: 'ACTIVE', emailVerifiedAt: '2026-02-14 10:30:00',
    lockedReason: null,
    orders: 1, spend: 1890000, lastPurchase: '25/10/2026', lastOrder: '#8TT-1023',
  },
  {
    id: 3, numericId: '#KH-0236',
    fullName: 'Lê Đức Anh', email: 'ducanh.le@gmail.com',
    phone: '0987123456', dateOfBirth: '1992-11-05', gender: 'Nam',
    receiveNewsletter: true, status: 'ACTIVE', emailVerifiedAt: '2025-12-20 14:00:00',
    lockedReason: null,
    orders: 5, spend: 10450000, lastPurchase: '25/10/2026', lastOrder: '#8TT-1022',
  },
  {
    id: 4, numericId: '#KH-0231',
    fullName: 'Phạm Ngọc Linh', email: 'ngoclinh.pham@gmail.com',
    phone: '0912678345', dateOfBirth: null, gender: null,
    receiveNewsletter: true, status: 'ACTIVE', emailVerifiedAt: '2026-03-10 09:45:00',
    lockedReason: null,
    orders: 3, spend: 4270000, lastPurchase: '25/10/2026', lastOrder: '#8TT-1021',
  },
  {
    id: 5, numericId: '#KH-0228',
    fullName: 'Võ Thanh Tùng', email: 'thanhtung.vo@gmail.com',
    phone: '0976543210', dateOfBirth: '1990-06-30', gender: 'Nam',
    receiveNewsletter: false, status: 'ACTIVE', emailVerifiedAt: '2026-04-01 11:00:00',
    lockedReason: null,
    orders: 4, spend: 6380000, lastPurchase: '25/10/2026', lastOrder: '#8TT-1020',
  },
  {
    id: 6, numericId: '#KH-0225',
    fullName: 'Đặng Gia Huy', email: 'giahuy.dang@gmail.com',
    phone: '0903876543', dateOfBirth: '1996-09-18', gender: 'Nam',
    receiveNewsletter: true, status: 'ACTIVE', emailVerifiedAt: '2026-01-28 16:20:00',
    lockedReason: null,
    orders: 2, spend: 5930000, lastPurchase: '24/10/2026', lastOrder: '#8TT-1019',
  },
  {
    id: 7, numericId: '#KH-0221',
    fullName: 'Bùi Thảo Vy', email: 'thaovy.bui@gmail.com',
    phone: '0945321678', dateOfBirth: '2000-02-14', gender: 'Nữ',
    receiveNewsletter: false, status: 'ACTIVE', emailVerifiedAt: '2026-05-03 13:10:00',
    lockedReason: null,
    orders: 1, spend: 350000, lastPurchase: '24/10/2026', lastOrder: '#8TT-1018',
  },
  {
    id: 8, numericId: '#KH-0219',
    fullName: 'Đỗ Quang Minh', email: 'quangminh.do@gmail.com',
    phone: '0968234901', dateOfBirth: '1988-12-01', gender: 'Nam',
    receiveNewsletter: false, status: 'LOCKED', emailVerifiedAt: '2025-11-15 07:30:00',
    lockedReason: 'Vi phạm chính sách đặt hàng nhiều lần – hủy đơn không có lý do.',
    orders: 2, spend: 2490000, lastPurchase: '24/10/2026', lastOrder: '#8TT-1017',
  },
  {
    id: 9, numericId: '#KH-0216',
    fullName: 'Ngô Hải Yến', email: 'haiyen.ngo@gmail.com',
    phone: '0923567890', dateOfBirth: '1997-04-25', gender: 'Nữ',
    receiveNewsletter: true, status: 'ACTIVE', emailVerifiedAt: '2026-02-20 10:00:00',
    lockedReason: null,
    orders: 3, spend: 4920000, lastPurchase: '24/10/2026', lastOrder: '#8TT-1016',
  },
];

const formatPrice = (price) => `${(price || 0).toLocaleString('vi-VN')} ₫`;
const formatPhone = (phone) => phone
  ? phone.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3')
  : '—';

/* ── Status badge ── */
function StatusBadge({ status }) {
  const isLocked = status === 'LOCKED';
  return (
    <span className={`cm-badge ${isLocked ? 'locked' : ''}`}>
      <i />{isLocked ? 'Đã khóa' : 'Hoạt động'}
    </span>
  );
}

/* ── Dropdown 3 chấm ── */
function ActionMenu({ customer, onView, onToggleLock }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isLocked = customer.status === 'LOCKED';

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="cm-action-wrap" ref={ref}>
      <button
        className="om-icon-button"
        aria-label={`Thao tác ${customer.fullName}`}
        onClick={() => setOpen((v) => !v)}
      >
        <IconDots size={17} />
      </button>
      {open && (
        <div className="cm-dropdown" role="menu">
          <button role="menuitem" onClick={() => { setOpen(false); onView(customer); }}>
            <IconEye size={14} />Xem chi tiết
          </button>
          <div className="cm-dropdown-sep" />
          <button
            role="menuitem"
            className={isLocked ? 'cm-menu-unlock' : 'cm-menu-lock'}
            onClick={() => { setOpen(false); onToggleLock(customer); }}
          >
            {isLocked ? <IconLockOpen size={14} /> : <IconLock size={14} />}
            {isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Modal khóa / mở khóa ── */
function LockDialog({ customer, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  const isLocked = customer.status === 'LOCKED';

  return (
    <div className="om-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="om-dialog cm-lock-dialog" role="dialog" aria-modal="true">
        <div className="om-dialog-heading">
          <div className="om-dialog-id">
            <span>{isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}</span>
            <h2>{customer.fullName}</h2>
          </div>
          <button className="om-icon-button" onClick={onClose} aria-label="Đóng"><IconX size={18} /></button>
        </div>

        <div className="cm-lock-body">
          {isLocked ? (
            <>
              <p className="cm-lock-desc">Tài khoản này hiện đang bị khóa. Mở khóa sẽ cho phép khách hàng đăng nhập và đặt hàng trở lại.</p>
              {customer.lockedReason && (
                <div className="cm-lock-current-reason">
                  <span>Lý do đang khóa</span>
                  <p>{customer.lockedReason}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="cm-lock-desc">Khóa tài khoản sẽ ngăn khách hàng đăng nhập và đặt hàng. Hành động này có thể hoàn tác.</p>
              <label className="cm-lock-label">
                Lý do khóa <span className="cm-required">*</span>
                <textarea
                  className="cm-lock-textarea"
                  placeholder="Nhập lý do khóa tài khoản..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  autoFocus
                />
              </label>
            </>
          )}
        </div>

        <div className="om-dialog-actions">
          <button className="om-button" onClick={onClose}>Hủy</button>
          <button
            className={`om-button cm-lock-confirm ${isLocked ? 'unlock' : 'lock'}`}
            onClick={() => onConfirm(customer, reason)}
            disabled={!isLocked && !reason.trim()}
          >
            {isLocked ? <IconLockOpen size={14} /> : <IconLock size={14} />}
            {isLocked ? 'Xác nhận mở khóa' : 'Xác nhận khóa'}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ── Modal chi tiết khách hàng ── */
function CustomerDialog({ customer, onClose, onToggleLock }) {
  const isLocked = customer.status === 'LOCKED';

  return (
    <div className="om-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="om-dialog" role="dialog" aria-modal="true" aria-labelledby="cm-dialog-title">

        {/* Header */}
        <div className="om-dialog-heading">
          <div className="om-dialog-id">
            <span>Khách hàng #{customer.id}</span>
            <h2 id="cm-dialog-title">{customer.fullName}</h2>
          </div>
          <div className="om-dialog-head-right">
            <div className="om-dialog-statuses">
              <StatusBadge status={customer.status} />
              {customer.emailVerifiedAt && (
                <span className="cm-verified-badge">Email đã xác minh</span>
              )}
            </div>
            <button className="om-icon-button" onClick={onClose} aria-label="Đóng"><IconX size={18} /></button>
          </div>
        </div>

        <div className="om-dialog-meta">
          <span>{customer.numericId}</span>
          <span className="om-dot" />
          <span>Đăng ký qua website</span>
          {customer.emailVerifiedAt && (
            <><span className="om-dot" /><span>Xác minh {customer.emailVerifiedAt.split(' ')[0]}</span></>
          )}
        </div>

        <div className="om-dialog-body">

          {/* Thông tin cá nhân */}
          <div className="om-dialog-section">
            <p className="om-section-label">Thông tin cá nhân</p>
            <div className="om-info-rows">
              <div className="om-info-row">
                <span>Họ tên</span>
                <strong>{customer.fullName}</strong>
              </div>
              <div className="om-info-row">
                <span>Email</span>
                <strong>{customer.email}</strong>
              </div>
              <div className="om-info-row">
                <span>Số điện thoại</span>
                <strong>{customer.phone ? formatPhone(customer.phone) : '—'}</strong>
              </div>
              <div className="om-info-row">
                <span>Ngày sinh</span>
                <strong>{customer.dateOfBirth || '—'}</strong>
              </div>
              <div className="om-info-row">
                <span>Giới tính</span>
                <strong>{customer.gender || '—'}</strong>
              </div>
              <div className="om-info-row">
                <span>Nhận bản tin</span>
                <strong>{customer.receiveNewsletter ? 'Có' : 'Không'}</strong>
              </div>
            </div>
          </div>

          {/* Tài khoản */}
          <div className="om-dialog-section">
            <p className="om-section-label">Tài khoản</p>
            <div className="om-info-rows">
              <div className="om-info-row">
                <span>Trạng thái</span>
                <StatusBadge status={customer.status} />
              </div>
              <div className="om-info-row">
                <span>Xác minh email</span>
                <strong>{customer.emailVerifiedAt || '—'}</strong>
              </div>
              {isLocked && customer.lockedReason && (
                <div className="om-info-row">
                  <span>Lý do khóa</span>
                  <strong className="om-note-text">{customer.lockedReason}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Lịch sử mua hàng */}
          <div className="om-dialog-section">
            <p className="om-section-label">Lịch sử mua hàng</p>
            <div className="om-info-rows">
              <div className="om-info-row">
                <span>Tổng số đơn</span>
                <strong>{customer.orders} đơn hàng</strong>
              </div>
              <div className="om-info-row">
                <span>Tổng chi tiêu</span>
                <strong className="cm-spend-highlight">{formatPrice(customer.spend)}</strong>
              </div>
              <div className="om-info-row">
                <span>Mua gần nhất</span>
                <strong>{customer.lastPurchase} · {customer.lastOrder}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="om-dialog-actions">
          <button
            className={`om-button cm-lock-btn ${isLocked ? 'unlock' : 'lock'}`}
            onClick={() => onToggleLock(customer)}
          >
            {isLocked ? <IconLockOpen size={14} /> : <IconLock size={14} />}
            {isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
          </button>
          <button className="om-button" onClick={onClose}>Đóng</button>
        </div>
      </section>
    </div>
  );
}

/* ── Main page ── */
export default function AdminCustomerManagement() {
  const [data, setData] = useState(customers);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [date, setDate] = useState('all');
  const [sort, setSort] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lockTarget, setLockTarget] = useState(null);
  const [notice, setNotice] = useState('');

  const filteredCustomers = useMemo(() => data.filter((c) => {
    const needle = query.trim().toLocaleLowerCase('vi');
    const matchesQuery = `${c.numericId} ${c.fullName} ${c.phone} ${c.email}`.toLocaleLowerCase('vi').includes(needle);
    const matchesStatus = statusFilter === 'all'
      || (statusFilter === 'active' ? c.status === 'ACTIVE' : c.status === 'LOCKED');
    const matchesTab = activeTab === 'all' || (activeTab === 'locked' && c.status === 'LOCKED');
    const matchesDate = date === 'all' || c.lastPurchase === date;
    return matchesQuery && matchesStatus && matchesTab && matchesDate;
  }).sort((a, b) => sort === 'oldest' ? a.id - b.id : b.id - a.id), [data, query, statusFilter, activeTab, date, sort]);

  const toggleAll = () => {
    const visibleIds = filteredCustomers.map((c) => c.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((cur) => allSelected ? cur.filter((id) => !visibleIds.includes(id)) : [...new Set([...cur, ...visibleIds])]);
  };
  const toggleCustomer = (id) => setSelectedIds((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);

  const exportCsv = () => {
    const selected = selectedIds.length ? data.filter((c) => selectedIds.includes(c.id)) : filteredCustomers;
    const rows = [
      ['ID', 'Mã KH', 'Họ tên', 'Email', 'Điện thoại', 'Ngày sinh', 'Giới tính', 'Nhận bản tin', 'Trạng thái', 'Xác minh email', 'Số đơn', 'Tổng chi tiêu', 'Mua gần nhất'],
      ...selected.map((c) => [c.id, c.numericId, c.fullName, c.email, c.phone, c.dateOfBirth || '', c.gender || '', c.receiveNewsletter ? 'Có' : 'Không', c.status, c.emailVerifiedAt || '', c.orders, c.spend, c.lastPurchase]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = '8threadtech-khach-hang.csv'; link.click(); URL.revokeObjectURL(url);
    setNotice(`Đã xuất ${selected.length} khách hàng.`);
  };

  const handleToggleLock = (customer) => {
    setSelectedCustomer(null);
    setLockTarget(customer);
  };

  const handleLockConfirm = (customer, reason) => {
    const isLocked = customer.status === 'LOCKED';
    setData((prev) => prev.map((c) => c.id === customer.id
      ? { ...c, status: isLocked ? 'ACTIVE' : 'LOCKED', lockedReason: isLocked ? null : reason }
      : c
    ));
    setLockTarget(null);
    setNotice(isLocked ? `Đã mở khóa tài khoản ${customer.fullName}.` : `Đã khóa tài khoản ${customer.fullName}.`);
  };

  const stats = [
    { label: 'Tổng khách hàng', value: '1.248', note: 'Khách hàng đã đăng ký', Icon: IconUsers },
    { label: 'Khách hàng mới', value: '86', note: '+18,6% so với tháng trước', Icon: IconUserPlus, alert: true },
    { label: 'Khách hàng quay lại', value: '324', note: 'Chiếm 26% tổng khách hàng', Icon: IconRepeat },
    { label: 'Khách hàng VIP', value: '48', note: 'Tổng chi tiêu từ 10.000.000 ₫', Icon: IconCrown },
  ];

  return (
    <div className="om-dashboard cm-dashboard">
      <AdminSidebar />
      <main className="om-main">
        <header className="om-topbar">
          <span>8ThreadTech</span><span className="om-slash">/</span><strong>Khách hàng</strong>
        </header>
        <div className="om-content cm-content">
          <section className="om-overview">
            <div className="om-title-row">
              <h1>Quản lý khách hàng</h1>
              <button className="om-button" onClick={exportCsv}><IconDownload size={16} />Xuất danh sách</button>
            </div>
            <div className="om-stats">
              {stats.map(({ label, value, note, Icon, alert }, index) => (
                <article className="om-stat" key={label}>
                  <div className="om-stat-label"><span>{label}</span><Icon size={17} stroke={1.5} /></div>
                  <strong>{value}</strong>
                  <small className={alert ? 'alert' : ''}>{note}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="cm-table-panel" aria-label="Danh sách khách hàng">
            {/* Tabs */}
            <div className="cm-tabs" role="tablist">
              <button role="tab" aria-selected={activeTab === 'all'} className={activeTab === 'all' ? 'selected' : ''} onClick={() => setActiveTab('all')}>
                Tất cả<span>1.248</span>
              </button>
              <button role="tab" aria-selected={activeTab === 'locked'} className={activeTab === 'locked' ? 'selected' : ''} onClick={() => setActiveTab('locked')}>
                Đã khóa<span>12</span>
              </button>
              <span className="cm-column-label"><IconColumns3 size={14} />Tùy chỉnh cột</span>
            </div>

            {/* Filters */}
            <div className="cm-filters">
              <label className="cm-search">
                <IconSearch size={16} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm tên, mã KH, email hoặc SĐT..." aria-label="Tìm khách hàng" />
              </label>
              <label>
                <span className="sr-only">Trạng thái</span>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="locked">Đã khóa</option>
                </select>
                <IconChevronDown size={14} />
              </label>
              <label>
                <IconCalendar size={15} />
                <span className="sr-only">Ngày tạo</span>
                <select value={date} onChange={(e) => setDate(e.target.value)}>
                  <option value="all">Ngày tạo: Tất cả</option>
                  <option>25/10/2026</option>
                  <option>24/10/2026</option>
                </select>
                <IconChevronDown size={14} />
              </label>
              <label>
                <span className="sr-only">Sắp xếp</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Sắp xếp: Mới nhất</option>
                  <option value="oldest">Sắp xếp: Cũ nhất</option>
                </select>
                <IconChevronDown size={14} />
              </label>
            </div>

            {/* Table */}
            <div className="cm-table-scroll">
              <table className="cm-table">
                <thead>
                  <tr>
                    <th className="cm-check-cell">
                      <input type="checkbox" aria-label="Chọn tất cả"
                        checked={filteredCustomers.length > 0 && filteredCustomers.every((c) => selectedIds.includes(c.id))}
                        onChange={toggleAll} />
                    </th>
                    <th>Khách hàng</th>
                    <th>Liên hệ</th>
                    <th>Ngày sinh</th>
                    <th className="align-right">Số đơn</th>
                    <th className="align-right">Tổng chi tiêu</th>
                    <th>Trạng thái</th>
                    <th>Mua gần nhất ↓</th>
                    <th className="align-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => (
                    <tr key={c.id}>
                      <td className="cm-check-cell">
                        <input type="checkbox" aria-label={`Chọn ${c.fullName}`} checked={selectedIds.includes(c.id)} onChange={() => toggleCustomer(c.id)} />
                      </td>
                      <td>
                        <div className="cm-customer-cell">
                          <strong>{c.fullName}</strong>
                          <small>{c.numericId}</small>
                        </div>
                      </td>
                      <td>
                        <div className="cm-contact-cell">
                          <span>{c.phone ? formatPhone(c.phone) : '—'}</span>
                          <small>{c.email}</small>
                        </div>
                      </td>
                      <td><span className="cm-dob">{c.dateOfBirth || '—'}</span></td>
                      <td className="align-right">{c.orders}</td>
                      <td className="align-right cm-spend">{formatPrice(c.spend)}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td>
                        <div className="cm-date-cell">
                          <span>{c.lastPurchase}</span>
                          <small>{c.lastOrder}</small>
                        </div>
                      </td>
                      <td>
                        <div className="om-row-actions">
                          <button className="om-icon-button" aria-label={`Xem ${c.fullName}`} onClick={() => setSelectedCustomer(c)}>
                            <IconEye size={16} />
                          </button>
                          <ActionMenu customer={c} onView={setSelectedCustomer} onToggleLock={handleToggleLock} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!filteredCustomers.length && (
                    <tr><td colSpan="9" className="cm-empty">Không tìm thấy khách hàng phù hợp.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="cm-pagination">
              <span>Hiển thị {filteredCustomers.length ? `1–${filteredCustomers.length}` : '0'} trong 1.248 khách hàng</span>
              <div>
                <small>9 / trang</small>
                <button aria-label="Trang trước" disabled><IconChevronLeft size={15} /></button>
                <button className="current" aria-current="page">1</button>
                <button disabled>2</button>
                <button disabled>3</button>
                <button disabled className="cm-ellipsis">…</button>
                <button disabled>139</button>
                <button disabled className="cm-next">Trang sau <IconChevronRight size={14} /></button>
              </div>
            </div>
          </section>

          <p className="om-updated">Cập nhật lần cuối lúc 23:59, 25/10/2026 • Múi giờ Việt Nam (GMT+7)</p>
        </div>
      </main>

      {selectedCustomer && (
        <CustomerDialog customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} onToggleLock={handleToggleLock} />
      )}
      {lockTarget && (
        <LockDialog customer={lockTarget} onClose={() => setLockTarget(null)} onConfirm={handleLockConfirm} />
      )}
      {notice && (
        <div className="om-toast" role="status">
          {notice}
          <button onClick={() => setNotice('')} aria-label="Đóng thông báo"><IconX size={15} /></button>
        </div>
      )}
    </div>
  );
}
