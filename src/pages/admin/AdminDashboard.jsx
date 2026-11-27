import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IconArrowRight, IconArrowUpRight, IconCalendar, IconChevronRight,
  IconClockHour3, IconPackage, IconReceipt, IconShoppingBag,
  IconTrendingDown, IconTrendingUp, IconTruck, IconWallet,
} from '@tabler/icons-react';
import fallbackImage from '../../assets/list-thread-75.png';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import { adminDashboardService } from '../../services/adminDashboardService.js';
import { ORDER_STATUS_LABELS } from '../../services/adminOrderService.js';
import './AdminDashboard.css';

const PERIOD_OPTIONS = [
  { value: 7, label: '7 ngày' },
  { value: 30, label: '30 ngày' },
  { value: 90, label: '90 ngày' },
];

// ---------- Định dạng ----------
const formatMoney = (value) => `${Math.round(Number(value) || 0).toLocaleString('vi-VN')} ₫`;
const formatNumber = (value) => (Number(value) || 0).toLocaleString('vi-VN');
const formatDay = (iso) => {
  const [, m, d] = String(iso).split('-');
  return `${d}/${m}`;
};
const formatFullDate = (iso) => {
  const [y, m, d] = String(iso).split('-');
  return `${d}/${m}/${y}`;
};
const formatDateTime = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm} · ${hh}:${mi}`;
};
const formatMillion = (value) =>
  (value / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 });

/** Bước chia trục tròn đẹp: 1, 2, 5, 10, 20, 50... (đơn vị đồng). */
function niceStep(raw) {
  if (raw <= 0) return 1_000_000;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

// ---------- Biểu đồ doanh thu ----------
const CHART_W = 648;
const CHART_H = 150;

function RevenueChart({ data, fromDate, toDate, days, onDaysChange }) {
  const chart = useMemo(() => {
    const points = data || [];
    const values = points.map((p) => Number(p.revenue) || 0);
    const max = Math.max(0, ...values);
    const step = niceStep(max / 3);
    const top = step * 3;

    const coords = points.map((p, i) => ({
      x: points.length > 1 ? (i * CHART_W) / (points.length - 1) : CHART_W / 2,
      y: CHART_H - ((Number(p.revenue) || 0) / top) * CHART_H,
      ...p,
    }));

    const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
    const area = coords.length
      ? `${line} L${coords[coords.length - 1].x.toFixed(1)} ${CHART_H} L${coords[0].x.toFixed(1)} ${CHART_H} Z`
      : '';

    // Điểm cao nhất để gắn nhãn
    const peak = max > 0 ? coords[values.indexOf(max)] : null;

    // Nhiều ngày quá thì chỉ hiện khoảng 7 nhãn ngày
    const every = Math.max(1, Math.ceil(points.length / 7));
    const labels = points
      .map((p, i) => ({ i, date: p.date }))
      .filter(({ i }) => i % every === 0 || i === points.length - 1);

    return { coords, line, area, peak, labels, axis: [top, step * 2, step, 0] };
  }, [data]);

  return (
    <section className="admin-panel admin-chart">
      <div className="admin-panel-heading">
        <div>
          <h2>Doanh thu theo ngày</h2>
          <p>
            {fromDate ? `${formatFullDate(fromDate)} – ${formatFullDate(toDate)}` : '...'} • Đơn vị: triệu đồng
          </p>
        </div>
        <select
          className="admin-period"
          value={days}
          onChange={(e) => onDaysChange(Number(e.target.value))}
          aria-label="Chọn khoảng thời gian"
        >
          {PERIOD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="admin-legend"><i /> Doanh thu</div>

      <div className="admin-chart-body">
        <div className="admin-axis">
          {chart.axis.map((v, i) => <span key={i}>{formatMillion(v)}</span>)}
        </div>
        <div className="admin-plot">
          <div className="admin-chart-grid"><i /><i /><i /><i /></div>
          <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" aria-label="Biểu đồ doanh thu theo ngày">
            <defs>
              <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#f02b24" stopOpacity=".13" />
                <stop offset="1" stopColor="#f02b24" stopOpacity="0" />
              </linearGradient>
            </defs>
            {chart.area && <path d={chart.area} fill="url(#revenue-fill)" />}
            {chart.line && (
              <path d={chart.line} fill="none" stroke="#f02b24" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            )}
            {chart.peak && (
              <line x1={chart.peak.x} y1={chart.peak.y} x2={chart.peak.x} y2={CHART_H} stroke="#f02b24" opacity=".25" />
            )}
          </svg>
          {chart.peak && (
            <span
              className="admin-chart-tip"
              style={{
                left: `${(chart.peak.x / CHART_W) * 100}%`,
                top: `${Math.max(chart.peak.y - 30, -8)}px`,
                transform: 'translateX(-50%)',
              }}
            >
              {formatMillion(Number(chart.peak.revenue))} triệu ₫ · {formatDay(chart.peak.date)}
            </span>
          )}
          <div className="admin-dates">
            {chart.labels.map(({ date }) => <span key={date}>{formatDay(date)}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Thẻ chỉ số ----------
function MetricCard({ label, icon: Icon, metric, format, days, loading }) {
  const change = metric?.changePercent;
  const TrendIcon = change != null && change < 0 ? IconTrendingDown : IconTrendingUp;

  return (
    <div className="admin-metric">
      <div className="admin-metric-label">{label}<Icon size={17} stroke={1.4} /></div>
      <strong>{loading || !metric ? '—' : format(metric.value)}</strong>
      <div className={`admin-comparison ${change == null ? '' : change < 0 ? 'down' : 'up'}`}>
        {change == null ? (
          <small>Chưa có dữ liệu {days} ngày trước</small>
        ) : (
          <>
            <TrendIcon size={13} />
            <span>{change > 0 ? '+' : ''}{change.toLocaleString('vi-VN')}%</span>
            <small>so với {days} ngày trước</small>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Trang ----------
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');

    adminDashboardService.getDashboard(days)
      .then((res) => { if (alive) setData(res); })
      .catch((err) => { if (alive) setError(err.message || 'Không tải được dữ liệu tổng quan.'); })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [days]);

  const tasks = data?.tasks;
  const taskRows = [
    [IconClockHour3, 'Đơn chờ xác nhận', 'Xác nhận để chuẩn bị hàng', tasks?.pendingConfirm, '/admin/orders'],
    [IconTruck, 'Đơn chờ giao', 'Đã xác nhận, bàn giao cho đơn vị vận chuyển', tasks?.waitingShipment, '/admin/orders'],
    [IconPackage, 'Biến thể sắp hết', `Tồn kho dưới ${tasks?.lowStockThreshold ?? 10} sản phẩm`, tasks?.lowStockVariants, '/admin/products'],
  ];

  const recentOrders = data?.recentOrders || [];
  const topProducts = data?.topProducts || [];

  return (
    <div className="admin-dashboard">
      <AdminSidebar active="dashboard" />
      <main className="admin-main">
        <header className="admin-topbar">
          <span>8ThreadTech</span><span className="admin-slash">/</span><strong>Dashboard</strong>
        </header>

        <div className="admin-content">
          <div className="admin-title-row">
            <h1>Tổng quan kinh doanh</h1>
            <div className="admin-date">
              <IconCalendar size={16} stroke={1.5} />
              {data ? `${formatFullDate(data.fromDate)} – ${formatFullDate(data.toDate)}` : '...'}
            </div>
          </div>

          {error && <p className="admin-error" role="alert">{error}</p>}

          <div className="admin-metrics">
            <MetricCard label="Doanh thu" icon={IconWallet} metric={data?.revenue} format={formatMoney} days={days} loading={loading} />
            <MetricCard label="Đơn hàng" icon={IconShoppingBag} metric={data?.orders} format={formatNumber} days={days} loading={loading} />
            <MetricCard label="Sản phẩm bán" icon={IconPackage} metric={data?.itemsSold} format={formatNumber} days={days} loading={loading} />
            <MetricCard label="Giá trị đơn trung bình" icon={IconReceipt} metric={data?.averageOrderValue} format={formatMoney} days={days} loading={loading} />
          </div>

          <div className="admin-grid">
            <RevenueChart
              data={data?.dailyRevenue}
              fromDate={data?.fromDate}
              toDate={data?.toDate}
              days={days}
              onDaysChange={setDays}
            />

            <section className="admin-panel admin-tasks">
              <div className="admin-panel-heading">
                <div><h2>Cần xử lý</h2><p>Ưu tiên để vận hành trơn tru hơn.</p></div>
              </div>
              <div className="admin-task-list">
                {taskRows.map(([Icon, title, description, count, href], index) => (
                  <Link to={href} className="admin-task" key={title}>
                    <span className={`admin-task-icon ${index === 0 && count > 0 ? 'urgent' : ''}`}>
                      <Icon size={17} stroke={1.5} />
                    </span>
                    <div><strong>{title}</strong><small>{description}</small></div>
                    <b>{count ?? '—'}</b>
                    <IconChevronRight size={14} />
                  </Link>
                ))}
              </div>
              <Link to="/admin/orders" className="admin-red-link">Quản lý đơn hàng <IconArrowRight size={14} /></Link>
            </section>

            <section className="admin-panel admin-orders">
              <div className="admin-section-heading">
                <h2>Đơn hàng gần đây</h2>
                <Link to="/admin/orders" className="admin-red-link">Xem tất cả <IconArrowUpRight size={14} /></Link>
              </div>
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr><th>Mã đơn</th><th>Khách hàng</th><th>Thời gian</th><th>Tổng tiền</th><th>Trạng thái</th><th aria-label="Chi tiết"></th></tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 && (
                      <tr><td colSpan={6} className="admin-muted">{loading ? 'Đang tải...' : 'Chưa có đơn hàng nào.'}</td></tr>
                    )}
                    {recentOrders.map((o) => (
                      <tr key={o.orderCode} className="admin-row-link" onClick={() => navigate('/admin/orders')}>
                        <td className="admin-order-id">#{o.orderCode}</td>
                        <td>{o.customerName}</td>
                        <td className="admin-muted">{formatDateTime(o.createdAt)}</td>
                        <td className="admin-total">{formatMoney(o.totalAmount)}</td>
                        <td>
                          <span className={`admin-status ${['PENDING', 'PENDING_PAYMENT'].includes(o.status) ? 'pending' : ''}`}>
                            {ORDER_STATUS_LABELS[o.status] || o.status}
                          </span>
                        </td>
                        <td><IconChevronRight size={14} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="admin-table-footer">
                {recentOrders.length} đơn mới nhất • {formatNumber(data?.orders?.value)} đơn hợp lệ trong {days} ngày qua
              </div>
            </section>

            <section className="admin-panel admin-products">
              <div className="admin-section-heading"><h2>Sản phẩm bán chạy</h2><span>{days} ngày qua</span></div>
              <div>
                {topProducts.length === 0 && (
                  <p className="admin-empty">{loading ? 'Đang tải...' : 'Chưa có sản phẩm nào được bán trong kỳ này.'}</p>
                )}
                {topProducts.map((p) => (
                  <div className="admin-product" key={p.productId}>
                    <img src={p.imageUrl || fallbackImage} alt="" onError={(e) => { e.currentTarget.src = fallbackImage; }} />
                    <div className="admin-product-info">
                      <strong>{p.name}</strong>
                      <small>Đơn giá TB {formatMoney(p.soldQuantity ? Number(p.revenue) / p.soldQuantity : 0)}</small>
                    </div>
                    <div className="admin-product-sales">
                      <strong>{formatNumber(p.soldQuantity)} đã bán</strong>
                      <small>{formatMoney(p.revenue)}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="admin-products-footer">
                <Link to="/admin/products" className="admin-red-link">Xem tất cả sản phẩm <IconArrowRight size={14} /></Link>
              </div>
            </section>
          </div>

          <p className="admin-updated">
            {data?.generatedAt
              ? `Cập nhật lúc ${new Date(data.generatedAt).toLocaleString('vi-VN')} • Doanh thu tính đơn đã đặt, không gồm đơn hủy và đơn chờ thanh toán online`
              : ''}
          </p>
        </div>
      </main>
    </div>
  );
}