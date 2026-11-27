import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IconAdjustments, IconAlertCircle, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconClockHour3, IconColumns3, IconDownload, IconEye, IconLoader2,
  IconShoppingBag, IconTruck, IconWallet, IconX,
} from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import {
  adminOrderService,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TRANSITIONS,
  PAYMENT_STATUS_LABELS,
} from '../../services/adminOrderService.js';
import './AdminOrderManagement.css';

/* ─────────────────────────── helpers ─────────────────────────── */

const formatPrice = (price) => `${(price || 0).toLocaleString('vi-VN')} ₫`;

const fmtDatetime = (iso) => {
  if (!iso) return { date: '—', time: '' };
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('vi-VN'),
    time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  };
};

const METHOD_LABELS = { COD: 'Thu hộ khi nhận (COD)', BANK_TRANSFER: 'Chuyển khoản', MOMO: 'Ví MoMo', VNPAY: 'VNPay', ZALOPAY: 'ZaloPay' };

/* ─────────────────────────── StatusBadge ─────────────────────── */

function StatusBadge({ value }) {
  const up = String(value || '').toUpperCase();
  const isSuccess = ['DELIVERED', 'PAID', 'REFUNDED', 'CONFIRMED'].includes(up);
  const isInfo    = ['SHIPPING', 'PENDING_PAYMENT', 'REFUND_PENDING'].includes(up);
  const isDanger  = ['CANCELLED'].includes(up);
  const cls = isSuccess ? 'success' : isInfo ? 'info' : isDanger ? 'danger' : 'pending';
  const label = ORDER_STATUS_LABELS[up] || PAYMENT_STATUS_LABELS[up] || value;
  return <span className={`om-badge ${cls}`}><i />{label}</span>;
}

/* ─────────────────────────── CancelReasonModal ──────────────── */

function CancelReasonModal({ onConfirm, onClose, loading }) {
  const [reason, setReason] = useState('');
  return (
    <div className="om-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="om-dialog om-dialog--sm" role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title">
        <div className="om-dialog-heading">
          <div className="om-dialog-id">
            <span>Hủy đơn hàng</span>
            <h2 id="cancel-modal-title">Nhập lý do hủy</h2>
          </div>
          <button className="om-icon-button" onClick={onClose} aria-label="Đóng"><IconX size={18} /></button>
        </div>
        <div className="om-dialog-body" style={{ padding: '1rem 1.5rem' }}>
          <p style={{ marginBottom: '0.75rem', color: 'var(--om-muted, #6b7280)', fontSize: '0.875rem' }}>
            Lý do hủy sẽ được lưu và hiển thị cho khách hàng. Tối đa 1000 ký tự.
          </p>
          <textarea
            className="om-textarea"
            rows={4}
            maxLength={1000}
            placeholder="Nhập lý do hủy đơn..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />
          <small style={{ color: 'var(--om-muted, #6b7280)', fontSize: '0.75rem' }}>{reason.length}/1000</small>
        </div>
        <div className="om-dialog-actions">
          <button className="om-button om-button--ghost" onClick={onClose} disabled={loading}>Hủy bỏ</button>
          <button className="om-button om-button--danger" onClick={() => onConfirm(reason)} disabled={loading || !reason.trim()}>
            {loading ? <IconLoader2 size={15} className="om-spin" /> : null}
            Xác nhận hủy đơn
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── StatusUpdatePanel ──────────────── */

function StatusUpdatePanel({ order, onUpdated, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancel, setShowCancel] = useState(false);

  const nextStatuses = ORDER_STATUS_TRANSITIONS[order.status] || [];

  const handleUpdate = async (status, note) => {
    setLoading(true);
    setError('');
    try {
      const updated = await adminOrderService.updateStatus(order.orderCode, status, note);
      onUpdated(updated || { ...order, status });
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setShowCancel(false);
    }
  };

  return (
    <>
      <div className="om-status-panel">
        <p className="om-section-label">Cập nhật trạng thái</p>
        {error && (
          <div className="om-inline-error">
            <IconAlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
        {nextStatuses.length === 0 ? (
          <p className="om-status-terminal">Đơn hàng đã kết thúc — không thể chuyển trạng thái.</p>
        ) : (
          <div className="om-status-actions">
            {nextStatuses.map((s) =>
              s === 'CANCELLED' ? (
                <button
                  key={s}
                  className="om-button om-button--danger"
                  onClick={() => setShowCancel(true)}
                  disabled={loading}
                >
                  Hủy đơn
                </button>
              ) : (
                <button
                  key={s}
                  className="om-button"
                  onClick={() => handleUpdate(s, '')}
                  disabled={loading}
                >
                  {loading ? <IconLoader2 size={14} className="om-spin" /> : null}
                  {ORDER_STATUS_LABELS[s] || s}
                </button>
              )
            )}
          </div>
        )}
      </div>
      {showCancel && (
        <CancelReasonModal
          loading={loading}
          onClose={() => setShowCancel(false)}
          onConfirm={(reason) => handleUpdate('CANCELLED', reason)}
        />
      )}
    </>
  );
}

/* ─────────────────────────── OrderDialog ────────────────────── */

function OrderDialog({ orderCode, onClose, onUpdated }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    adminOrderService.getOrderDetail(orderCode)
      .then((data) => { if (!cancelled) setOrder(data); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Không tải được chi tiết đơn.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [orderCode]);

  const handleUpdated = (updated) => {
    setOrder((prev) => ({ ...prev, ...updated }));
    onUpdated(updated);
  };

  const { date, time } = order ? fmtDatetime(order.createdAt) : {};
  const fullAddress = order
    ? [order.addressLine, order.ward, order.district, order.province].filter(Boolean).join(', ')
    : '';

  return (
    <div className="om-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="om-dialog" role="dialog" aria-modal="true" aria-labelledby="om-dialog-title">

        {/* Header */}
        <div className="om-dialog-heading">
          <div className="om-dialog-id">
            <span>Mã đơn hàng</span>
            <h2 id="om-dialog-title">{orderCode}</h2>
          </div>
          <div className="om-dialog-head-right">
            {order && (
              <div className="om-dialog-statuses">
                <StatusBadge value={order.status} />
                <StatusBadge value={order.paymentStatus} />
              </div>
            )}
            <button className="om-icon-button" onClick={onClose} aria-label="Đóng"><IconX size={18} /></button>
          </div>
        </div>

        {loading && (
          <div className="om-dialog-loading">
            <IconLoader2 size={28} className="om-spin" />
            <span>Đang tải...</span>
          </div>
        )}

        {error && !loading && (
          <div className="om-dialog-error">
            <IconAlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {order && !loading && (
          <>
            <div className="om-dialog-meta">
              <span>{date}{time ? ` · ${time}` : ''}</span>
              <span className="om-dot" />
              <span>{order.shippingMethodName || 'Giao hàng tiêu chuẩn'}</span>
              <span className="om-dot" />
              <span>{METHOD_LABELS[order.paymentMethod] || order.paymentMethod || 'COD'}</span>
              {order.sourceType && <><span className="om-dot" /><span>Nguồn: {order.sourceType}</span></>}
            </div>

            <div className="om-dialog-body">

              {/* Sản phẩm */}
              <div className="om-dialog-section">
                <p className="om-section-label">Sản phẩm</p>
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  <div className="om-items-list">
                    {order.items.map((item, i) => (
                      <div key={i} className="om-product-row">
                        <div>
                          <strong className="om-product-name">{item.productName || item.name}</strong>
                          {item.sku && <small className="om-product-sku"> · SKU: {item.sku}</small>}
                          {item.options && <small className="om-product-sku"> · {item.options}</small>}
                          <span className="om-product-qty">x{item.quantity}</span>
                        </div>
                        <span className="om-product-price">{formatPrice(item.subtotal || item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="om-empty-inline">Không có thông tin sản phẩm.</p>
                )}
              </div>

              {/* Khách hàng */}
              <div className="om-dialog-section">
                <p className="om-section-label">Khách hàng</p>
                <div className="om-info-rows">
                  <div className="om-info-row"><span>Họ tên</span><strong>{order.customerName || '—'}</strong></div>
                  <div className="om-info-row"><span>Số điện thoại</span><strong>{order.customerPhone || '—'}</strong></div>
                  {order.customerEmail && <div className="om-info-row"><span>Email</span><strong>{order.customerEmail}</strong></div>}
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="om-dialog-section">
                <p className="om-section-label">Địa chỉ giao hàng</p>
                <div className="om-info-rows">
                  <div className="om-info-row"><span>Địa chỉ</span><strong>{order.addressLine || '—'}</strong></div>
                  <div className="om-info-row"><span>Phường / Xã</span><strong>{order.ward || '—'}</strong></div>
                  <div className="om-info-row"><span>Quận / Huyện</span><strong>{order.district || '—'}</strong></div>
                  <div className="om-info-row"><span>Tỉnh / Thành phố</span><strong>{order.province || '—'}</strong></div>
                  {order.customerNote && (
                    <div className="om-info-row">
                      <span>Ghi chú khách</span>
                      <strong className="om-note-text">"{order.customerNote}"</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Vận chuyển */}
              <div className="om-dialog-section">
                <p className="om-section-label">Vận chuyển</p>
                <div className="om-info-rows">
                  <div className="om-info-row"><span>Phương thức</span><strong>{order.shippingMethodName || 'Giao hàng tiêu chuẩn'}</strong></div>
                  {order.shippingMethodCode && <div className="om-info-row"><span>Mã</span><strong>{order.shippingMethodCode}</strong></div>}
                </div>
              </div>

              {/* Thanh toán */}
              <div className="om-dialog-section">
                <p className="om-section-label">Thanh toán</p>
                <div className="om-info-rows">
                  <div className="om-info-row">
                    <span>Phương thức</span>
                    <strong>{METHOD_LABELS[order.paymentMethod] || order.paymentMethod || '—'}</strong>
                  </div>
                  <div className="om-info-row">
                    <span>Trạng thái</span>
                    <StatusBadge value={order.paymentStatus} />
                  </div>
                  {order.paymentDeadline && (
                    <div className="om-info-row"><span>Hạn thanh toán</span><strong>{order.paymentDeadline}</strong></div>
                  )}
                  <div className="om-info-row om-row-separator">
                    <span>Tiền hàng</span>
                    <strong>{formatPrice(order.subtotalAmount)}</strong>
                  </div>
                  <div className="om-info-row">
                    <span>Phí vận chuyển</span>
                    <strong>{formatPrice(order.shippingFee ?? 0)}</strong>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="om-info-row">
                      <span>Giảm giá{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                      <strong className="om-discount">-{formatPrice(order.discountAmount)}</strong>
                    </div>
                  )}
                  <div className="om-info-row om-total-row">
                    <span>Tổng thanh toán</span>
                    <strong>{formatPrice(order.totalAmount)}</strong>
                  </div>
                </div>
              </div>

              {/* Lý do hủy */}
              {order.cancelReason && (
                <div className="om-dialog-section om-cancel-section">
                  <p className="om-section-label">Lý do hủy đơn</p>
                  <p className="om-cancel-reason">{order.cancelReason}</p>
                </div>
              )}

              {/* Cập nhật trạng thái */}
              <StatusUpdatePanel order={order} onUpdated={handleUpdated} onClose={onClose} />

            </div>

            <div className="om-dialog-actions">
              <button className="om-button" onClick={onClose}>Đóng</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ─────────────────────────── Tabs config ────────────────────── */

const STATUS_TABS = [
  { key: 'all',             label: 'Tất cả' },
  { key: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
  { key: 'PENDING',         label: 'Chờ xác nhận' },
  { key: 'CONFIRMED',       label: 'Đã xác nhận' },
  { key: 'SHIPPING',        label: 'Đang giao' },
  { key: 'DELIVERED',       label: 'Đã giao' },
  { key: 'CANCELLED',       label: 'Đã hủy' },
];

const PAGE_SIZE = 10;

/* ─────────────────────────── Main page ─────────────────────── */

export default function AdminOrderManagement() {
  const [orders, setOrders]           = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [pageNumber, setPageNumber]   = useState(0);
  const [loading, setLoading]         = useState(false);
  const [fetchError, setFetchError]   = useState('');

  const [query, setQuery]       = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sort, setSort]         = useState('newest');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedIds, setSelectedIds]     = useState([]);
  const [notice, setNotice]               = useState('');

  const debounceRef = useRef(null);

  /* ── fetch ── */
  const fetchOrders = useCallback(async (page, search, status, sortOpt) => {
    setLoading(true);
    setFetchError('');
    try {
      const sortBy        = sortOpt === 'amount_desc' ? 'totalAmount' : 'createdAt';
      const sortDirection = sortOpt === 'oldest' || sortOpt === 'amount_asc' ? 'asc' : 'desc';

      const result = await adminOrderService.getOrders({
        page,
        size: PAGE_SIZE,
        sortBy,
        sortDirection,
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
      });

      setOrders(result.content);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages || 1);
      setPageNumber(result.pageNumber);
    } catch (err) {
      setFetchError(err.message || 'Không tải được danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, []);

  /* initial + filter changes */
  useEffect(() => {
    setPageNumber(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchOrders(0, query, activeTab, sort);
    }, query ? 350 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [query, activeTab, sort, fetchOrders]);

  /* pagination */
  const goToPage = (p) => {
    setPageNumber(p);
    fetchOrders(p, query, activeTab, sort);
  };

  /* selection */
  const toggleAll = () => {
    const ids = orders.map((o) => o.orderCode);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds((cur) => allSelected
      ? cur.filter((id) => !ids.includes(id))
      : [...new Set([...cur, ...ids])]);
  };
  const toggleOne = (code) => setSelectedIds((cur) => cur.includes(code) ? cur.filter((x) => x !== code) : [...cur, code]);

  /* export CSV */
  const exportCsv = () => {
    const rows = [
      ['Mã đơn', 'Khách hàng', 'SĐT', 'Email', 'Giá trị', 'Trạng thái', 'Thanh toán', 'Ngày đặt'],
      ...orders
        .filter((o) => !selectedIds.length || selectedIds.includes(o.orderCode))
        .map((o) => {
          const { date } = fmtDatetime(o.createdAt);
          return [
            o.orderCode, o.customerName, o.customerPhone, o.customerEmail || '',
            o.totalAmount, ORDER_STATUS_LABELS[o.status] || o.status,
            PAYMENT_STATUS_LABELS[o.paymentStatus] || o.paymentStatus, date,
          ];
        }),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = '8threadtech-don-hang.csv'; a.click();
    URL.revokeObjectURL(url);
    setNotice('Đã xuất danh sách đơn hàng.');
  };

  /* after status update in dialog */
  const handleOrderUpdated = (updatedOrder) => {
    setOrders((prev) => prev.map((o) => o.orderCode === updatedOrder.orderCode ? { ...o, ...updatedOrder } : o));
    setNotice(`Đã cập nhật trạng thái đơn ${updatedOrder.orderCode}.`);
  };

  /* pagination buttons */
  const pageButtons = () => {
    const pages = [];
    for (let p = 0; p < totalPages; p++) pages.push(p);
    if (totalPages <= 7) return pages;
    // Show: first, last, current ± 1, ellipsis
    const visible = new Set([0, totalPages - 1, pageNumber, pageNumber - 1, pageNumber + 1].filter((p) => p >= 0 && p < totalPages));
    return [...visible].sort((a, b) => a - b);
  };

  return (
    <div className="om-dashboard">
      <AdminSidebar />
      <main className="om-main">
        <header className="om-topbar">
          <span>8ThreadTech</span>
          <span className="om-slash">/</span>
          <strong>Đơn hàng</strong>
        </header>

        <div className="om-content">
          {/* Overview stats */}
          <section className="om-overview">
            <div className="om-title-row">
              <h1>Quản lý đơn hàng</h1>
              <button className="om-button" onClick={exportCsv}>
                <IconDownload size={16} />Xuất đơn hàng
              </button>
            </div>
            <div className="om-stats">
              {[
                { label: 'Tổng đơn', value: totalElements, note: 'Theo bộ lọc hiện tại', Icon: IconShoppingBag },
                { label: 'Chờ xác nhận', value: '—', note: 'Cần xử lý sớm', Icon: IconClockHour3, alert: true },
                { label: 'Đang giao', value: '—', note: 'Đã bàn giao vận chuyển', Icon: IconTruck },
                { label: 'Doanh thu', value: '—', note: 'Từ đơn đã thanh toán', Icon: IconWallet },
              ].map(({ label, value, note, Icon, alert }) => (
                <article className="om-stat" key={label}>
                  <div className="om-stat-label"><span>{label}</span><Icon size={17} stroke={1.5} /></div>
                  <strong>{value}</strong>
                  <small className={alert ? 'alert' : ''}>{note}</small>
                </article>
              ))}
            </div>
          </section>

          {/* Table panel */}
          <section className="om-table-panel" aria-label="Danh sách đơn hàng">
            {/* Tabs */}
            <div className="om-tabs" role="tablist" aria-label="Lọc theo trạng thái">
              {STATUS_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeTab === key}
                  className={activeTab === key ? 'selected' : ''}
                  onClick={() => { setActiveTab(key); setSelectedIds([]); }}
                >
                  {label}
                </button>
              ))}
              <span className="om-column-label"><IconColumns3 size={14} />Tùy chỉnh cột</span>
            </div>

            {/* Filters */}
            <div className="om-filters">
              <label className="om-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm mã đơn, tên hoặc SĐT khách hàng..."
                  aria-label="Tìm đơn hàng"
                />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="Xóa tìm kiếm" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                    <IconX size={14} />
                  </button>
                )}
              </label>
              <label>
                <span className="sr-only">Sắp xếp</span>
                <IconAdjustments size={15} />
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="amount_desc">Giá trị cao → thấp</option>
                  <option value="amount_asc">Giá trị thấp → cao</option>
                </select>
                <IconChevronDown size={14} />
              </label>
            </div>

            {/* Error banner */}
            {fetchError && (
              <div className="om-fetch-error">
                <IconAlertCircle size={16} />
                <span>{fetchError}</span>
                <button onClick={() => fetchOrders(pageNumber, query, activeTab, sort)}>Thử lại</button>
              </div>
            )}

            {/* Table */}
            <div className="om-table-scroll">
              <table className="om-table">
                <thead>
                  <tr>
                    <th className="om-check-cell">
                      <input
                        type="checkbox"
                        aria-label="Chọn tất cả"
                        checked={orders.length > 0 && orders.every((o) => selectedIds.includes(o.orderCode))}
                        onChange={toggleAll}
                      />
                    </th>
                    <th>Mã đơn hàng</th>
                    <th>Khách hàng</th>
                    <th className="align-right">Giá trị</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Ngày đặt</th>
                    <th className="align-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="8" className="om-empty">
                        <IconLoader2 size={20} className="om-spin" style={{ marginRight: '0.5rem' }} />
                        Đang tải...
                      </td>
                    </tr>
                  )}
                  {!loading && orders.length === 0 && !fetchError && (
                    <tr>
                      <td colSpan="8" className="om-empty">Không tìm thấy đơn hàng phù hợp.</td>
                    </tr>
                  )}
                  {!loading && orders.map((order) => {
                    const { date, time } = fmtDatetime(order.createdAt);
                    return (
                      <tr key={order.orderCode}>
                        <td className="om-check-cell">
                          <input
                            type="checkbox"
                            aria-label={`Chọn đơn ${order.orderCode}`}
                            checked={selectedIds.includes(order.orderCode)}
                            onChange={() => toggleOne(order.orderCode)}
                          />
                        </td>
                        <td>
                          <div className="om-order-cell">
                            <strong>{order.orderCode}</strong>
                            <small>{METHOD_LABELS[order.paymentMethod] || order.paymentMethod}</small>
                          </div>
                        </td>
                        <td>
                          <div className="om-customer-cell">
                            <span>{order.customerName}</span>
                            <small>{order.customerPhone}</small>
                          </div>
                        </td>
                        <td className="align-right om-amount">{formatPrice(order.totalAmount)}</td>
                        <td><StatusBadge value={order.paymentStatus} /></td>
                        <td><StatusBadge value={order.status} /></td>
                        <td>
                          <div className="om-date-cell">
                            <span>{date}</span>
                            <small>{time}</small>
                          </div>
                        </td>
                        <td>
                          <div className="om-row-actions">
                            <button
                              className="om-icon-button"
                              aria-label={`Xem đơn ${order.orderCode}`}
                              onClick={() => setSelectedOrder(order.orderCode)}
                            >
                              <IconEye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="om-pagination">
              <span>
                {totalElements > 0
                  ? `Hiển thị ${pageNumber * PAGE_SIZE + 1}–${Math.min((pageNumber + 1) * PAGE_SIZE, totalElements)} trong ${totalElements} đơn hàng`
                  : '0 đơn hàng'}
              </span>
              <div>
                <button
                  aria-label="Trang trước"
                  disabled={pageNumber === 0 || loading}
                  onClick={() => goToPage(pageNumber - 1)}
                >
                  <IconChevronLeft size={15} />
                </button>

                {pageButtons().map((p, i, arr) => (
                  <>
                    {i > 0 && arr[i] - arr[i - 1] > 1 && (
                      <button key={`ellipsis-${p}`} disabled className="om-ellipsis">…</button>
                    )}
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      disabled={loading}
                      className={p === pageNumber ? 'current' : ''}
                      aria-current={p === pageNumber ? 'page' : undefined}
                    >
                      {p + 1}
                    </button>
                  </>
                ))}

                <button
                  disabled={pageNumber >= totalPages - 1 || loading}
                  onClick={() => goToPage(pageNumber + 1)}
                  className="om-next"
                  aria-label="Trang sau"
                >
                  Trang sau <IconChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>

          <p className="om-updated">
            Dữ liệu trực tiếp từ API · Múi giờ Việt Nam (GMT+7)
          </p>
        </div>
      </main>

      {/* Detail Dialog */}
      {selectedOrder && (
        <OrderDialog
          orderCode={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={handleOrderUpdated}
        />
      )}

      {/* Toast */}
      {notice && (
        <div className="om-toast" role="status">
          {notice}
          <button onClick={() => setNotice('')} aria-label="Đóng thông báo">
            <IconX size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
