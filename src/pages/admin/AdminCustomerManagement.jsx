import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IconChevronDown, IconChevronLeft, IconChevronRight,
  IconColumns3, IconCrown, IconDots, IconDownload, IconEye,
  IconLock, IconLockOpen, IconRepeat, IconSearch,
  IconUserPlus, IconUsers, IconX,
} from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import { adminCustomerService } from '../../services/adminCustomerService.js';
import './AdminOrderManagement.css';
import './AdminCustomerManagement.css';

const PAGE_SIZE = 9;

const formatPrice = (price) => `${Number(price || 0).toLocaleString('vi-VN')} ₫`;
const formatPhone = (phone) => phone
  ? phone.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3')
  : '—';
const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString('vi-VN');
};
const formatDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleString('vi-VN');
};

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
function LockDialog({ customer, loading, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  const isLocked = customer.status === 'LOCKED';

  return (
    <div className="om-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <section className="om-dialog cm-lock-dialog" role="dialog" aria-modal="true">
        <div className="om-dialog-heading">
          <div className="om-dialog-id">
            <span>{isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}</span>
            <h2>{customer.fullName}</h2>
          </div>
          <button className="om-icon-button" onClick={onClose} disabled={loading} aria-label="Đóng"><IconX size={18} /></button>
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
                  maxLength={500}
                  autoFocus
                />
              </label>
            </>
          )}
        </div>

        <div className="om-dialog-actions">
          <button className="om-button" onClick={onClose} disabled={loading}>Hủy</button>
          <button
            className={`om-button cm-lock-confirm ${isLocked ? 'unlock' : 'lock'}`}
            onClick={() => onConfirm(customer, reason)}
            disabled={loading || (!isLocked && !reason.trim())}
          >
            {isLocked ? <IconLockOpen size={14} /> : <IconLock size={14} />}
            {loading ? 'Đang xử lý...' : isLocked ? 'Xác nhận mở khóa' : 'Xác nhận khóa'}
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
            <><span className="om-dot" /><span>Xác minh {formatDate(customer.emailVerifiedAt)}</span></>
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
                <strong>{formatDateTime(customer.emailVerifiedAt)}</strong>
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
                <strong>
                  {customer.lastPurchaseAt
                    ? `${formatDate(customer.lastPurchaseAt)}${customer.lastOrder ? ` · ${customer.lastOrder}` : ''}`
                    : 'Chưa có đơn hàng'}
                </strong>
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
  const [data, setData] = useState([]);
  const [statsData, setStatsData] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    returningCustomers: 0,
    vipCustomers: 0,
    lockedCustomers: 0,
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lockLoading, setLockLoading] = useState(false);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [sort, setSort] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lockTarget, setLockTarget] = useState(null);
  const [notice, setNotice] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const statsRes = await adminCustomerService.getStats();
      setStatsData(statsRes);
    } catch {
      // Giữ số liệu hiện tại nếu lỗi tạm thời
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const effectiveStatus = activeTab === 'locked'
        ? 'LOCKED'
        : statusFilter === 'all'
          ? undefined
          : statusFilter.toUpperCase();

      const res = await adminCustomerService.getCustomers({
        page,
        size: PAGE_SIZE,
        sortDirection: sort === 'oldest' ? 'asc' : 'desc',
        search: query.trim() || undefined,
        status: effectiveStatus,
      });

      setData(res.content);
      setTotalPages(Math.max(res.totalPages || 1, 1));
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      setNotice(err?.message || 'Không thể tải danh sách khách hàng.');
    } finally {
      setLoading(false);
    }
  }, [page, sort, query, statusFilter, activeTab]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0);
    setSelectedIds([]);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(0);
    setSelectedIds([]);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(0);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(0);
  };

  const toggleAll = () => {
    const visibleIds = data.map((c) => c.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((cur) => allSelected ? cur.filter((id) => !visibleIds.includes(id)) : [...new Set([...cur, ...visibleIds])]);
  };
  const toggleCustomer = (id) => setSelectedIds((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);

  const exportCsv = () => {
    const selected = selectedIds.length ? data.filter((c) => selectedIds.includes(c.id)) : data;
    const rows = [
      ['ID', 'Mã KH', 'Họ tên', 'Email', 'Điện thoại', 'Ngày sinh', 'Giới tính', 'Nhận bản tin', 'Trạng thái', 'Xác minh email', 'Số đơn', 'Tổng chi tiêu', 'Mua gần nhất'],
      ...selected.map((c) => [c.id, c.numericId, c.fullName, c.email, c.phone || '', c.dateOfBirth || '', c.gender || '', c.receiveNewsletter ? 'Có' : 'Không', c.status, formatDateTime(c.emailVerifiedAt), c.orders, c.spend, formatDate(c.lastPurchaseAt)]),
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

  const handleLockConfirm = async (customer, reason) => {
    const isLocked = customer.status === 'LOCKED';
    const nextStatus = isLocked ? 'ACTIVE' : 'LOCKED';
    setLockLoading(true);
    try {
      const updated = await adminCustomerService.updateStatus(customer.id, nextStatus, isLocked ? undefined : reason);
      setData((prev) => prev.map((c) => (c.id === customer.id ? updated : c)));
      setLockTarget(null);
      setNotice(isLocked ? `Đã mở khóa tài khoản ${customer.fullName}.` : `Đã khóa tài khoản ${customer.fullName}.`);
      fetchStats();
      if (activeTab === 'locked' || statusFilter !== 'all') {
        fetchCustomers();
      }
    } catch (err) {
      setNotice(err?.message || 'Không thể cập nhật trạng thái tài khoản.');
    } finally {
      setLockLoading(false);
    }
  };

  const stats = [
    { label: 'Tổng khách hàng', value: statsData.totalCustomers.toLocaleString('vi-VN'), note: 'Khách hàng đã đăng ký', Icon: IconUsers },
    { label: 'Khách hàng mới', value: statsData.newCustomers.toLocaleString('vi-VN'), note: 'Đăng ký trong tháng này', Icon: IconUserPlus, alert: true },
    { label: 'Khách hàng quay lại', value: statsData.returningCustomers.toLocaleString('vi-VN'), note: 'Từ 2 đơn hàng trở lên', Icon: IconRepeat },
    { label: 'Khách hàng VIP', value: statsData.vipCustomers.toLocaleString('vi-VN'), note: 'Tổng chi tiêu từ 10.000.000 ₫', Icon: IconCrown },
  ];

  const startIndex = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const endIndex = Math.min((page + 1) * PAGE_SIZE, totalElements);

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
              {stats.map(({ label, value, note, Icon, alert }) => (
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
              <button role="tab" aria-selected={activeTab === 'all'} className={activeTab === 'all' ? 'selected' : ''} onClick={() => handleTabChange('all')}>
                Tất cả<span>{statsData.totalCustomers.toLocaleString('vi-VN')}</span>
              </button>
              <button role="tab" aria-selected={activeTab === 'locked'} className={activeTab === 'locked' ? 'selected' : ''} onClick={() => handleTabChange('locked')}>
                Đã khóa<span>{statsData.lockedCustomers.toLocaleString('vi-VN')}</span>
              </button>
              <span className="cm-column-label"><IconColumns3 size={14} />Tùy chỉnh cột</span>
            </div>

            {/* Filters */}
            <div className="cm-filters">
              <label className="cm-search">
                <IconSearch size={16} />
                <input value={query} onChange={(e) => handleQueryChange(e.target.value)} placeholder="Tìm tên, mã KH, email hoặc SĐT..." aria-label="Tìm khách hàng" />
              </label>
              <label>
                <span className="sr-only">Trạng thái</span>
                <select value={statusFilter} onChange={(e) => handleStatusFilterChange(e.target.value)} disabled={activeTab === 'locked'}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="locked">Đã khóa</option>
                </select>
                <IconChevronDown size={14} />
              </label>
              <label>
                <span className="sr-only">Sắp xếp</span>
                <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
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
                        checked={data.length > 0 && data.every((c) => selectedIds.includes(c.id))}
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
                  {loading ? (
                    <tr><td colSpan="9" className="cm-empty">Đang tải dữ liệu khách hàng...</td></tr>
                  ) : data.map((c) => (
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
                          <span>{formatDate(c.lastPurchaseAt)}</span>
                          <small>{c.lastOrder || '—'}</small>
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
                  {!loading && !data.length && (
                    <tr><td colSpan="9" className="cm-empty">Không tìm thấy khách hàng phù hợp.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="cm-pagination">
              <span>Hiển thị {totalElements ? `${startIndex}–${endIndex}` : '0'} trong {totalElements.toLocaleString('vi-VN')} khách hàng</span>
              <div>
                <small>{PAGE_SIZE} / trang</small>
                <button aria-label="Trang trước" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                  <IconChevronLeft size={15} />
                </button>
                <button className="current" aria-current="page">{page + 1}</button>
                <button disabled={page + 1 >= totalPages} className="cm-next" onClick={() => setPage((p) => p + 1)}>
                  Trang sau <IconChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>

          <p className="om-updated">Múi giờ Việt Nam (GMT+7)</p>
        </div>
      </main>

      {selectedCustomer && (
        <CustomerDialog customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} onToggleLock={handleToggleLock} />
      )}
      {lockTarget && (
        <LockDialog customer={lockTarget} loading={lockLoading} onClose={() => setLockTarget(null)} onConfirm={handleLockConfirm} />
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
