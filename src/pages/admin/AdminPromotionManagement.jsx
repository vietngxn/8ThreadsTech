import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IconAlertCircle, IconCalendar, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconClockHour3, IconColumns3, IconDownload, IconEdit, IconEye, IconLoader2,
  IconPlus, IconSearch, IconTicket, IconTrash, IconX,
} from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import {
  adminCouponService,
  COUPON_STATUS_LABELS,
  DISCOUNT_TYPE_LABELS,
  getCouponDisplayStatus,
} from '../../services/adminCouponService.js';
import './AdminOrderManagement.css';
import './AdminPromotionManagement.css';

/* ─────────────────────────── helpers ─────────────────────────── */

const formatPrice = (v) => v != null ? `${Number(v).toLocaleString('vi-VN')} ₫` : '—';
const fmtDatetime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN');
};
const toLocalDatetimeInput = (iso) => {
  if (!iso) return '';
  return iso.slice(0, 16); // "YYYY-MM-DDTHH:mm"
};
const toApiDatetime = (val) => val ? val.replace('T', 'T').slice(0, 19) : null; // "YYYY-MM-DDTHH:mm:ss"

const PAGE_SIZE = 10;

/* ─────────────────────────── StatusBadge ─────────────────────── */

function CouponStatusBadge({ coupon }) {
  const ds = getCouponDisplayStatus(coupon);
  const map = {
    active: ['success', 'Đang diễn ra'],
    upcoming: ['info', 'Sắp diễn ra'],
    ended: ['promo-ended', 'Đã kết thúc'],
    inactive: ['pending', 'Tạm dừng'],
  };
  const [cls, label] = map[ds] || ['pending', ds];
  return <span className={`om-badge ${cls}`}><i />{label}</span>;
}

/* ─────────────────────────── UsageBar ───────────────────────── */

function UsageBar({ coupon }) {
  const { usageCount, usageLimit, remainingUsage } = coupon;
  if (usageLimit == null) {
    return (
      <div className="promo-usage">
        <span>{usageCount ?? 0} / ∞</span>
        <div><i style={{ width: '0%' }} /></div>
      </div>
    );
  }
  const pct = usageLimit > 0 ? Math.min((usageCount / usageLimit) * 100, 100) : 0;
  const ds = getCouponDisplayStatus(coupon);
  return (
    <div className="promo-usage">
      <span>{usageCount} / {usageLimit}</span>
      <div><i className={ds === 'ended' || ds === 'inactive' ? 'muted' : ''} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

/* ─────────────────────────── CouponForm ─────────────────────── */

const EMPTY_FORM = {
  code: '', name: '', description: '',
  discountType: 'PERCENTAGE', discountValue: '',
  minOrderValue: '0', maxDiscountAmount: '',
  usageLimit: '', perUserUsageLimit: '1',
  startsAt: '', expiresAt: '',
  status: 'ACTIVE',
};

function CouponForm({ initial, onSave, onClose, loading, error }) {
  const [form, setForm] = useState(() => initial
    ? {
        code: initial.code || '',
        name: initial.name || '',
        description: initial.description || '',
        discountType: initial.discountType || 'PERCENTAGE',
        discountValue: String(initial.discountValue ?? ''),
        minOrderValue: String(initial.minOrderValue ?? '0'),
        maxDiscountAmount: initial.maxDiscountAmount != null ? String(initial.maxDiscountAmount) : '',
        usageLimit: initial.usageLimit != null ? String(initial.usageLimit) : '',
        perUserUsageLimit: String(initial.perUserUsageLimit ?? '1'),
        startsAt: toLocalDatetimeInput(initial.startsAt),
        expiresAt: toLocalDatetimeInput(initial.expiresAt),
        status: initial.status || 'ACTIVE',
      }
    : EMPTY_FORM
  );

  const [localError, setLocalError] = useState('');

  const set = (key) => (e) => {
    setLocalError('');
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleCodeChange = (e) => {
    setLocalError('');
    const sanitized = e.target.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'D')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    setForm((f) => ({ ...f, code: sanitized }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    if (!code) {
      setLocalError('Vui lòng nhập mã khuyến mãi.');
      return;
    }
    if (!/^[A-Z0-9]+$/.test(code)) {
      setLocalError('Mã khuyến mãi chỉ được chứa chữ in hoa không dấu và số, viết liền (VD: QUOCKHANH29).');
      return;
    }
    const payload = {
      code,
      name: form.name.trim(),
      description: form.description.trim() || null,
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue),
      minOrderValue: parseFloat(form.minOrderValue) || 0,
      maxDiscountAmount: form.maxDiscountAmount !== '' ? parseFloat(form.maxDiscountAmount) : null,
      usageLimit: form.usageLimit !== '' ? parseInt(form.usageLimit, 10) : null,
      perUserUsageLimit: parseInt(form.perUserUsageLimit, 10),
      startsAt: form.startsAt ? toApiDatetime(form.startsAt) + ':00' : null,
      expiresAt: form.expiresAt ? toApiDatetime(form.expiresAt) + ':00' : null,
      status: form.status,
    };
    onSave(payload);
  };

  const isEdit = !!initial;

  return (
    <div className="om-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="om-dialog promo-form-dialog" role="dialog" aria-modal="true" aria-labelledby="promo-form-title">
        <div className="om-dialog-heading">
          <div className="om-dialog-id">
            <span>{isEdit ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới'}</span>
            <h2 id="promo-form-title">{isEdit ? initial.code : 'Thông tin mã giảm giá'}</h2>
          </div>
          <button className="om-icon-button" onClick={onClose} aria-label="Đóng"><IconX size={18} /></button>
        </div>

        {(localError || error) && (
          <div className="om-fetch-error" style={{ margin: '14px 20px 0' }}>
            <IconAlertCircle size={15} /><span>{localError || error}</span>
          </div>
        )}

        <form className="promo-form-wrap" onSubmit={handleSubmit} noValidate>
          <div className="om-dialog-body promo-form">
          {/* Mã & tên */}
          <div className="promo-form-row">
            <div className="promo-form-group">
              <label htmlFor="pf-code">Mã khuyến mãi <span className="req">*</span></label>
              <input id="pf-code" required maxLength={50} placeholder="VD: QUOCKHANH29"
                value={form.code} onChange={handleCodeChange}
                pattern="[A-Z0-9]+"
                disabled={isEdit} // code không đổi khi sửa
              />
              <small className="promo-hint">
                {isEdit ? 'Mã không thể thay đổi sau khi tạo.' : 'Chữ in hoa không dấu và số, viết liền.'}
              </small>
            </div>
            <div className="promo-form-group">
              <label htmlFor="pf-status">Trạng thái <span className="req">*</span></label>
              <div className="promo-select-wrap">
                <select id="pf-status" value={form.status} onChange={set('status')}>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Tạm dừng</option>
                </select>
                <IconChevronDown size={14} />
              </div>
            </div>
          </div>

          <div className="promo-form-group">
            <label htmlFor="pf-name">Tên chương trình <span className="req">*</span></label>
            <input id="pf-name" required maxLength={150} placeholder="VD: Ưu đãi mùa hè"
              value={form.name} onChange={set('name')} />
          </div>

          <div className="promo-form-group">
            <label htmlFor="pf-desc">Mô tả</label>
            <textarea id="pf-desc" className="om-textarea" rows={2} maxLength={500}
              placeholder="Mô tả ngắn về chương trình (tùy chọn)"
              value={form.description} onChange={set('description')} />
          </div>

          {/* Loại & giá trị giảm */}
          <div className="promo-form-section-title">Mức giảm giá</div>
          <div className="promo-form-row">
            <div className="promo-form-group">
              <label htmlFor="pf-dtype">Loại giảm <span className="req">*</span></label>
              <div className="promo-select-wrap">
                <select id="pf-dtype" value={form.discountType} onChange={set('discountType')}>
                  <option value="PERCENTAGE">Phần trăm (%)</option>
                  <option value="FIXED">Số tiền cố định (₫)</option>
                </select>
                <IconChevronDown size={14} />
              </div>
            </div>
            <div className="promo-form-group">
              <label htmlFor="pf-dval">
                Giá trị giảm <span className="req">*</span>
                <small className="promo-hint">
                  {form.discountType === 'PERCENTAGE' ? '(%, tối đa 100)' : '(₫)'}
                </small>
              </label>
              <input id="pf-dval" type="number" required min={0.01}
                max={form.discountType === 'PERCENTAGE' ? 100 : undefined}
                step="any" placeholder="VD: 10"
                value={form.discountValue} onChange={set('discountValue')} />
            </div>
          </div>

          <div className="promo-form-row">
            <div className="promo-form-group">
              <label htmlFor="pf-min">Đơn tối thiểu (₫) <span className="req">*</span></label>
              <input id="pf-min" type="number" min={0} step="1000" placeholder="VD: 500000"
                value={form.minOrderValue} onChange={set('minOrderValue')} />
            </div>
            <div className="promo-form-group">
              <label htmlFor="pf-maxd">
                Giảm tối đa (₫)
                <small className="promo-hint">(tùy chọn, dùng cho %)</small>
              </label>
              <input id="pf-maxd" type="number" min={1} step="1000" placeholder="VD: 100000"
                value={form.maxDiscountAmount} onChange={set('maxDiscountAmount')} />
            </div>
          </div>

          {/* Giới hạn sử dụng */}
          <div className="promo-form-section-title">Giới hạn sử dụng</div>
          <div className="promo-form-row">
            <div className="promo-form-group">
              <label htmlFor="pf-ulimit">
                Tổng lượt dùng
                <small className="promo-hint">(để trống = không giới hạn)</small>
              </label>
              <input id="pf-ulimit" type="number" min={1} step={1} placeholder="VD: 200"
                value={form.usageLimit} onChange={set('usageLimit')} />
              {isEdit && initial?.usageCount > 0 && (
                <small className="promo-hint">Đã dùng: {initial.usageCount} — không được thấp hơn con số này.</small>
              )}
            </div>
            <div className="promo-form-group">
              <label htmlFor="pf-perlimit">Mỗi khách tối đa <span className="req">*</span></label>
              <input id="pf-perlimit" type="number" required min={1} step={1} placeholder="VD: 1"
                value={form.perUserUsageLimit} onChange={set('perUserUsageLimit')} />
            </div>
          </div>

          {/* Thời gian */}
          <div className="promo-form-section-title">Thời gian hiệu lực</div>
          <div className="promo-form-row">
            <div className="promo-form-group">
              <label htmlFor="pf-start">Bắt đầu <span className="req">*</span></label>
              <input id="pf-start" type="datetime-local" required
                value={form.startsAt} onChange={set('startsAt')} />
            </div>
            <div className="promo-form-group">
              <label htmlFor="pf-end">Kết thúc <span className="req">*</span></label>
              <input id="pf-end" type="datetime-local" required
                min={form.startsAt || undefined}
                value={form.expiresAt} onChange={set('expiresAt')} />
            </div>
          </div>

          </div>

          <div className="om-dialog-actions">
            <button type="button" className="om-button om-button--ghost" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="om-button promo-primary" disabled={loading}>
              {loading && <IconLoader2 size={15} className="om-spin" />}
              {isEdit ? 'Lưu thay đổi' : 'Tạo khuyến mãi'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

/* ─────────────────────────── DetailDialog ───────────────────── */

function DetailDialog({ couponId, onClose, onEdit, onDelete }) {
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminCouponService.getCoupon(couponId)
      .then((data) => { if (!cancelled) setCoupon(data); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Không tải được chi tiết.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [couponId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminCouponService.deleteCoupon(couponId);
      onDelete(couponId);
    } catch (err) {
      setError(err.message || 'Xóa thất bại.');
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const canDelete = coupon && (coupon.usageCount === 0 || coupon.usageCount == null);

  return (
    <div className="om-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="om-dialog" role="dialog" aria-modal="true" aria-labelledby="promo-detail-title">
        <div className="om-dialog-heading">
          <div className="om-dialog-id">
            <span>Chi tiết khuyến mãi</span>
            <h2 id="promo-detail-title">{coupon?.code ?? '…'}</h2>
          </div>
          <div className="om-dialog-head-right">
            {coupon && <CouponStatusBadge coupon={coupon} />}
            <button className="om-icon-button" onClick={onClose} aria-label="Đóng"><IconX size={18} /></button>
          </div>
        </div>

        {loading && (
          <div className="om-dialog-loading"><IconLoader2 size={28} className="om-spin" /><span>Đang tải...</span></div>
        )}
        {error && !loading && (
          <div className="om-dialog-error"><IconAlertCircle size={18} /><span>{error}</span></div>
        )}

        {coupon && !loading && (
          <div className="om-dialog-body">

            <div className="om-dialog-section">
              <p className="om-section-label">Thông tin chung</p>
              <div className="om-info-rows">
                <div className="om-info-row"><span>Mã</span><strong className="promo-code-mono">{coupon.code}</strong></div>
                <div className="om-info-row"><span>Tên chương trình</span><strong>{coupon.name}</strong></div>
                {coupon.description && <div className="om-info-row"><span>Mô tả</span><strong>{coupon.description}</strong></div>}
              </div>
            </div>

            <div className="om-dialog-section">
              <p className="om-section-label">Mức giảm giá</p>
              <div className="om-info-rows">
                <div className="om-info-row">
                  <span>Loại giảm</span>
                  <strong>{DISCOUNT_TYPE_LABELS[coupon.discountType] || coupon.discountType}</strong>
                </div>
                <div className="om-info-row">
                  <span>Giá trị</span>
                  <strong>
                    {coupon.discountType === 'PERCENTAGE'
                      ? `${coupon.discountValue}%`
                      : formatPrice(coupon.discountValue)}
                  </strong>
                </div>
                <div className="om-info-row">
                  <span>Đơn tối thiểu</span>
                  <strong>{formatPrice(coupon.minOrderValue)}</strong>
                </div>
                {coupon.maxDiscountAmount != null && (
                  <div className="om-info-row">
                    <span>Giảm tối đa</span>
                    <strong>{formatPrice(coupon.maxDiscountAmount)}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="om-dialog-section">
              <p className="om-section-label">Giới hạn & sử dụng</p>
              <div className="om-info-rows">
                <div className="om-info-row">
                  <span>Tổng lượt dùng</span>
                  <strong>{coupon.usageCount} / {coupon.usageLimit ?? '∞'}</strong>
                </div>
                {coupon.remainingUsage != null && (
                  <div className="om-info-row"><span>Còn lại</span><strong>{coupon.remainingUsage}</strong></div>
                )}
                <div className="om-info-row"><span>Mỗi khách tối đa</span><strong>{coupon.perUserUsageLimit} lần</strong></div>
              </div>
            </div>

            <div className="om-dialog-section">
              <p className="om-section-label">Thời gian hiệu lực</p>
              <div className="om-info-rows">
                <div className="om-info-row"><span>Bắt đầu</span><strong>{fmtDatetime(coupon.startsAt)}</strong></div>
                <div className="om-info-row"><span>Kết thúc</span><strong>{fmtDatetime(coupon.expiresAt)}</strong></div>
              </div>
            </div>

            {!canDelete && (
              <div className="promo-used-note">
                <IconAlertCircle size={14} />
                Khuyến mãi đã được sử dụng — không thể xóa. Hãy chuyển sang <strong>Tạm dừng</strong> nếu muốn vô hiệu hóa.
              </div>
            )}

            {confirmDelete && (
              <div className="promo-confirm-delete">
                <p>Bạn có chắc muốn xóa mã <strong>{coupon.code}</strong>? Hành động này không thể hoàn tác.</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button className="om-button om-button--ghost" onClick={() => setConfirmDelete(false)} disabled={deleting}>Hủy</button>
                  <button className="om-button om-button--danger" onClick={handleDelete} disabled={deleting}>
                    {deleting && <IconLoader2 size={14} className="om-spin" />}Xác nhận xóa
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {coupon && !loading && (
          <div className="om-dialog-actions">
            {canDelete && !confirmDelete && (
              <button className="om-button om-button--danger" onClick={() => setConfirmDelete(true)}>
                <IconTrash size={15} />Xóa
              </button>
            )}
            <button className="om-button om-button--ghost" onClick={onClose}>Đóng</button>
            <button className="om-button promo-primary" onClick={() => onEdit(coupon)}>
              <IconEdit size={15} />Chỉnh sửa
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

/* ─────────────────────────── Status Tabs ────────────────────── */

const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'ACTIVE', label: 'Đang hoạt động' },
  { key: 'INACTIVE', label: 'Tạm dừng' },
];

/* ─────────────────────────── Main page ─────────────────────── */

export default function AdminPromotionManagement() {
  const [coupons, setCoupons]           = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages]     = useState(1);
  const [pageNumber, setPageNumber]     = useState(0);
  const [loading, setLoading]           = useState(false);
  const [fetchError, setFetchError]     = useState('');

  const [query, setQuery]       = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sort, setSort]         = useState('newest');

  // dialog states
  const [viewId, setViewId]           = useState(null);   // ID xem chi tiết
  const [editCoupon, setEditCoupon]   = useState(null);   // null = ẩn, {} = tạo mới, obj = sửa
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]     = useState('');

  const [notice, setNotice]           = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const debounceRef = useRef(null);

  /* ── fetch ── */
  const fetchCoupons = useCallback(async (page, search, status, sortOpt) => {
    setLoading(true);
    setFetchError('');
    try {
      const sortBy        = sortOpt === 'expires' ? 'expiresAt' : 'createdAt';
      const sortDirection = sortOpt === 'oldest' ? 'asc' : 'desc';
      const result = await adminCouponService.getCoupons({
        page, size: PAGE_SIZE, sortBy, sortDirection,
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
      });
      setCoupons(result.content);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages || 1);
      setPageNumber(result.pageNumber);
    } catch (err) {
      setFetchError(err.message || 'Không tải được danh sách khuyến mãi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPageNumber(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchCoupons(0, query, activeTab, sort), query ? 350 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [query, activeTab, sort, fetchCoupons]);

  const goToPage = (p) => { setPageNumber(p); fetchCoupons(p, query, activeTab, sort); };

  /* ── selection ── */
  const toggleAll = () => {
    const ids = coupons.map((c) => c.id);
    const all = ids.every((id) => selectedIds.includes(id));
    setSelectedIds((cur) => all ? cur.filter((id) => !ids.includes(id)) : [...new Set([...cur, ...ids])]);
  };
  const toggleOne = (id) => setSelectedIds((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);

  /* ── CRUD ── */
  const handleSave = async (payload) => {
    setFormLoading(true);
    setFormError('');
    try {
      if (editCoupon?.id) {
        await adminCouponService.updateCoupon(editCoupon.id, payload);
        setNotice(`Đã cập nhật khuyến mãi ${payload.code}.`);
      } else {
        await adminCouponService.createCoupon(payload);
        setNotice(`Đã tạo khuyến mãi ${payload.code}.`);
      }
      setEditCoupon(null);
      fetchCoupons(pageNumber, query, activeTab, sort);
    } catch (err) {
      setFormError(err.message || 'Lưu thất bại. Vui lòng thử lại.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleted = (id) => {
    setNotice('Đã xóa khuyến mãi.');
    setViewId(null);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setTotalElements((n) => n - 1);
  };

  const handleEditFromDetail = (coupon) => {
    setViewId(null);
    setEditCoupon(coupon);
  };

  /* ── CSV export ── */
  const exportCsv = () => {
    const rows = [
      ['Mã', 'Tên', 'Loại giảm', 'Giá trị', 'Đơn tối thiểu', 'Lượt dùng', 'Giới hạn', 'Bắt đầu', 'Kết thúc', 'Trạng thái'],
      ...coupons
        .filter((c) => !selectedIds.length || selectedIds.includes(c.id))
        .map((c) => [
          c.code, c.name,
          DISCOUNT_TYPE_LABELS[c.discountType] || c.discountType,
          c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : c.discountValue,
          c.minOrderValue, c.usageCount, c.usageLimit ?? '∞',
          fmtDatetime(c.startsAt), fmtDatetime(c.expiresAt),
          COUPON_STATUS_LABELS[c.status] || c.status,
        ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = '8threadtech-khuyen-mai.csv'; a.click();
    URL.revokeObjectURL(url);
    setNotice('Đã xuất danh sách khuyến mãi.');
  };

  /* ── pagination buttons ── */
  const pageButtons = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i);
    if (totalPages <= 7) return pages;
    const visible = new Set([0, totalPages - 1, pageNumber, pageNumber - 1, pageNumber + 1].filter((p) => p >= 0 && p < totalPages));
    return [...visible].sort((a, b) => a - b);
  };

  return (
    <div className="om-dashboard promo-dashboard">
      <AdminSidebar />
      <main className="om-main">
        <header className="om-topbar">
          <span>8ThreadTech</span><span className="om-slash">/</span><strong>Khuyến mãi</strong>
        </header>

        <div className="om-content">
          {/* Overview */}
          <section className="om-overview">
            <div className="om-title-row promo-title-row">
              <div>
                <h1>Quản lý khuyến mãi</h1>
                <p>Tạo và quản lý mã giảm giá, chương trình ưu đãi cho cửa hàng.</p>
              </div>
              <div className="promo-title-actions">
                <button className="om-button" onClick={exportCsv}>
                  <IconDownload size={16} />Xuất danh sách
                </button>
                <button className="om-button promo-primary" onClick={() => { setEditCoupon({}); setFormError(''); }}>
                  <IconPlus size={16} />Tạo khuyến mãi
                </button>
              </div>
            </div>
            <div className="om-stats">
              {[
                { label: 'Tổng khuyến mãi', value: totalElements, note: 'Theo bộ lọc hiện tại', Icon: IconTicket },
                { label: 'Đang hoạt động', value: '—', note: 'Đang áp dụng cho khách', Icon: IconTicket },
                { label: 'Sắp diễn ra', value: '—', note: 'Đã lên lịch kích hoạt', Icon: IconClockHour3 },
                { label: 'Thời gian', value: '—', note: 'Hiển thị theo GMT+7', Icon: IconCalendar },
              ].map(({ label, value, note, Icon }) => (
                <article className="om-stat" key={label}>
                  <div className="om-stat-label"><span>{label}</span><Icon size={17} stroke={1.5} /></div>
                  <strong>{value}</strong>
                  <small>{note}</small>
                </article>
              ))}
            </div>
          </section>

          {/* Table */}
          <section className="om-table-panel" aria-label="Danh sách khuyến mãi">
            {/* Tabs */}
            <div className="om-tabs" role="tablist" aria-label="Trạng thái khuyến mãi">
              {STATUS_TABS.map(({ key, label }) => (
                <button key={key} role="tab"
                  aria-selected={activeTab === key}
                  className={activeTab === key ? 'selected' : ''}
                  onClick={() => { setActiveTab(key); setSelectedIds([]); }}>
                  {label}
                </button>
              ))}
              <span className="om-column-label"><IconColumns3 size={14} />Tùy chỉnh cột</span>
            </div>

            {/* Filters */}
            <div className="om-filters">
              <label className="om-search">
                <IconSearch size={16} />
                <input value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm mã hoặc tên chương trình khuyến mãi..."
                  aria-label="Tìm khuyến mãi" />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="Xóa" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                    <IconX size={14} />
                  </button>
                )}
              </label>
              <label>
                <span className="sr-only">Sắp xếp</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="expires">Sắp hết hạn</option>
                </select>
                <IconChevronDown size={14} />
              </label>
            </div>

            {fetchError && (
              <div className="om-fetch-error">
                <IconAlertCircle size={16} /><span>{fetchError}</span>
                <button onClick={() => fetchCoupons(pageNumber, query, activeTab, sort)}>Thử lại</button>
              </div>
            )}

            {/* Table */}
            <div className="om-table-scroll">
              <table className="om-table promo-table">
                <colgroup>
                  <col style={{ width: 48 }} />
                  <col style={{ width: '28%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: 80 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="om-check-cell">
                      <input type="checkbox" aria-label="Chọn tất cả"
                        checked={coupons.length > 0 && coupons.every((c) => selectedIds.includes(c.id))}
                        onChange={toggleAll} />
                    </th>
                    <th>Mã / Chương trình</th>
                    <th>Mức giảm</th>
                    <th>Điều kiện</th>
                    <th>Thời gian</th>
                    <th>Lượt dùng</th>
                    <th>Trạng thái</th>
                    <th className="align-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan="8" className="om-empty">
                      <IconLoader2 size={18} className="om-spin" style={{ marginRight: '0.5rem' }} />Đang tải...
                    </td></tr>
                  )}
                  {!loading && coupons.length === 0 && !fetchError && (
                    <tr><td colSpan="8" className="om-empty">Không tìm thấy khuyến mãi phù hợp.</td></tr>
                  )}
                  {!loading && coupons.map((c) => (
                    <tr key={c.id}>
                      <td className="om-check-cell">
                        <input type="checkbox" aria-label={`Chọn ${c.code}`}
                          checked={selectedIds.includes(c.id)}
                          onChange={() => toggleOne(c.id)} />
                      </td>
                      <td>
                        <div className="promo-cell">
                          <strong className="promo-code-mono">{c.code}</strong>
                          <small>{c.name}</small>
                        </div>
                      </td>
                      <td>
                        <div className="promo-cell">
                          <strong>
                            {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : formatPrice(c.discountValue)}
                          </strong>
                          {c.maxDiscountAmount != null && (
                            <small>Tối đa {formatPrice(c.maxDiscountAmount)}</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="promo-cell">
                          <span>Từ {formatPrice(c.minOrderValue)}</span>
                          <small>Mỗi khách: {c.perUserUsageLimit}x</small>
                        </div>
                      </td>
                      <td>
                        <div className="promo-cell">
                          <span>{fmtDatetime(c.startsAt)}</span>
                          <small>đến {fmtDatetime(c.expiresAt)}</small>
                        </div>
                      </td>
                      <td><UsageBar coupon={c} /></td>
                      <td><CouponStatusBadge coupon={c} /></td>
                      <td>
                        <div className="om-row-actions">
                          <button className="om-icon-button" aria-label={`Xem ${c.code}`}
                            onClick={() => setViewId(c.id)}>
                            <IconEye size={16} />
                          </button>
                          <button className="om-icon-button" aria-label={`Sửa ${c.code}`}
                            onClick={() => { setEditCoupon(c); setFormError(''); }}>
                            <IconEdit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="om-pagination">
              <span>
                {totalElements > 0
                  ? `Hiển thị ${pageNumber * PAGE_SIZE + 1}–${Math.min((pageNumber + 1) * PAGE_SIZE, totalElements)} trong ${totalElements} khuyến mãi`
                  : '0 khuyến mãi'}
              </span>
              <div>
                <button aria-label="Trang trước" disabled={pageNumber === 0 || loading} onClick={() => goToPage(pageNumber - 1)}>
                  <IconChevronLeft size={15} />
                </button>
                {pageButtons().map((p, i, arr) => (
                  <span key={p}>
                    {i > 0 && arr[i] - arr[i - 1] > 1 && <button disabled className="om-ellipsis">…</button>}
                    <button onClick={() => goToPage(p)} disabled={loading}
                      className={p === pageNumber ? 'current' : ''}
                      aria-current={p === pageNumber ? 'page' : undefined}>
                      {p + 1}
                    </button>
                  </span>
                ))}
                <button disabled={pageNumber >= totalPages - 1 || loading} onClick={() => goToPage(pageNumber + 1)} className="om-next" aria-label="Trang sau">
                  Trang sau <IconChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>

          <p className="om-updated">Dữ liệu trực tiếp từ API · Múi giờ Việt Nam (GMT+7)</p>
        </div>
      </main>

      {/* Detail Dialog */}
      {viewId && (
        <DetailDialog
          couponId={viewId}
          onClose={() => setViewId(null)}
          onEdit={handleEditFromDetail}
          onDelete={handleDeleted}
        />
      )}

      {/* Create / Edit Form */}
      {editCoupon !== null && (
        <CouponForm
          initial={editCoupon?.id ? editCoupon : null}
          onSave={handleSave}
          onClose={() => setEditCoupon(null)}
          loading={formLoading}
          error={formError}
        />
      )}

      {/* Toast */}
      {notice && (
        <div className="om-toast" role="status">
          {notice}
          <button onClick={() => setNotice('')} aria-label="Đóng thông báo"><IconX size={15} /></button>
        </div>
      )}
    </div>
  );
}
