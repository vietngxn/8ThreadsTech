import {
  IconArrowRight, IconArrowUpRight, IconCalendar, IconChartLine, IconChevronDown,
  IconChevronRight, IconClockHour3, IconFileText, IconFolder, IconHelpCircle,
  IconLayoutDashboard, IconPackage, IconReceipt,
  IconSettings, IconShoppingBag, IconTicket, IconTrendingUp, IconUsers, IconWallet,
} from '@tabler/icons-react';
import logo from '../../assets/thread-logo.png';
import keyboard75 from '../../assets/list-thread-75.png';
import keyboard65 from '../../assets/list-thread-65.png';
import keyboard98 from '../../assets/list-thread-98.png';
import keyboard80 from '../../assets/list-thread-80-pro.png';
import keyboard60 from '../../assets/list-thread-60-he.png';
import './AdminDashboard.css';

const navigation = [
  [IconLayoutDashboard, 'Dashboard'], [IconPackage, 'Sản phẩm'], [IconFolder, 'Danh mục'],
  [IconShoppingBag, 'Đơn hàng', '12'], [IconUsers, 'Khách hàng'], [IconTicket, 'Khuyến mãi'],
  [IconChartLine, 'Thống kê'], [IconFileText, 'Nhật kí'],
];
const metrics = [
  ['Doanh thu', '128.400.000 ₫', '12,8%', IconWallet],
  ['Đơn hàng', '214', '8,1%', IconShoppingBag],
  ['Sản phẩm bán', '326', '10,1%', IconPackage],
  ['Giá trị đơn trung bình', '600.000 ₫', '4,4%', IconReceipt],
];
const tasks = [
  [IconClockHour3, 'Đơn chờ xác nhận', 'Xác nhận để chuẩn bị hàng', '12'],
  [IconPackage, 'Đơn chờ lấy hàng', 'Bàn giao cho đơn vị vận chuyển', '8'],
  [IconPackage, 'Sản phẩm sắp hết', 'Tồn kho dưới 10 sản phẩm', '5'],
];
const orders = [
  ['#DH1028', 'Nguyễn Ngọc Hà', '25/10 · 16:42', '680.000 ₫', 'Chờ xác nhận'],
  ['#DH1027', 'Trần Minh Khang', '25/10 · 15:18', '540.000 ₫', 'Chờ lấy hàng'],
  ['#DH1026', 'Lê Thảo Vy', '25/10 · 14:36', '850.000 ₫', 'Đang giao'],
  ['#DH1025', 'Phạm Hoàng Nam', '25/10 · 11:05', '290.000 ₫', 'Đang giao'],
  ['#DH1024', 'Đỗ Minh Tâm', '25/10 · 09:24', '720.000 ₫', 'Hoàn thành'],
];
const products = [
  [keyboard75, 'THREAD 75', 'Bạc ánh trăng / Linear Red Switch · 2.490.000 ₫', '64', '159.360.000 ₫'],
  [keyboard65, 'THREAD 65', 'Đen nguyên bản / Linear Switch · 1.890.000 ₫', '58', '109.620.000 ₫'],
  [keyboard98, 'THREAD 98', 'Trắng sương / Tactile Brown Switch · 2.190.000 ₫', '42', '92.180.000 ₫'],
  [keyboard80, 'THREAD 80 PRO', 'Xám titan / Linear Silver Switch · 3.290.000 ₫', '36', '118.440.000 ₫'],
  [keyboard60, 'THREAD 60 HE', 'Đỏ dung nham / Switch từ tính · 2.790.000 ₫', '28', '77.820.000 ₫'],
];

function Sidebar() {
  return <aside className="admin-sidebar" data-node-id="45:2219">
    <a className="admin-brand" href="/" aria-label="8ThreadTech - về cửa hàng"><img src={logo} alt="" /><strong>8ThreadTech</strong></a>
    <nav aria-label="Quản lý"><div className="admin-nav-label">QUẢN LÝ</div>
      {navigation.map(([Icon, label, count], index) => { const content = <><Icon size={19} stroke={1.5} /><span>{label}</span>{count && <b>{count}</b>}</>; return index === 0 ? <a className="admin-nav-item active" href="/admin" key={label} aria-current="page">{content}</a> : index === 1 ? <a className="admin-nav-item" href="/admin/products" key={label}>{content}</a> : <div className="admin-nav-item" key={label}>{content}</div>; })}
    </nav>
    <div className="admin-sidebar-bottom"><div className="admin-support"><IconHelpCircle size={19} stroke={1.5} />Trung tâm trợ giúp</div><div className="admin-support"><IconSettings size={19} stroke={1.5} />Cài đặt</div>
      <div className="admin-account"><span className="admin-avatar">MA</span><span><strong>Minh Anh</strong><small>Admin</small></span><IconChevronDown size={14} /></div>
    </div>
  </aside>;
}

function RevenueChart() {
  return <section className="admin-panel admin-chart" data-node-id="45:2337">
    <div className="admin-panel-heading"><div><h2>Doanh thu theo ngày</h2><p>19 – 25/10/2026 • Đơn vị: triệu đồng</p></div><span className="admin-period">Theo ngày <IconChevronDown size={13} /></span></div>
    <div className="admin-legend"><i /> Doanh thu</div>
    <div className="admin-chart-body"><div className="admin-axis"><span>30</span><span>20</span><span>10</span><span>0</span></div><div className="admin-plot"><div className="admin-chart-grid"><i /><i /><i /><i /></div><svg viewBox="0 0 648 150" preserveAspectRatio="none" aria-label="Biểu đồ doanh thu từ 19 đến 25 tháng 10"><defs><linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f02b24" stopOpacity=".13"/><stop offset="1" stopColor="#f02b24" stopOpacity="0"/></linearGradient></defs><path d="M0 78 L108 56 L216 70 L324 38 L432 61 L540 26 L648 74 L648 150 L0 150 Z" fill="url(#revenue-fill)"/><path d="M0 78 L108 56 L216 70 L324 38 L432 61 L540 26 L648 74" fill="none" stroke="#f02b24" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/><line x1="540" y1="26" x2="540" y2="150" stroke="#f02b24" opacity=".25"/><circle cx="540" cy="26" r="4" fill="#f02b24" stroke="white" strokeWidth="2"/></svg><span className="admin-chart-tip">24,8 triệu ₫</span><div className="admin-dates">{['19/10','20/10','21/10','22/10','23/10','24/10','25/10'].map(date => <span key={date}>{date}</span>)}</div></div></div>
  </section>;
}

export default function AdminDashboard() {
  return <div className="admin-dashboard" data-node-id="45:2218"><Sidebar /><main className="admin-main"><header className="admin-topbar"><span>8ThreadTech</span><span className="admin-slash">/</span><strong>Dashboard</strong></header>
    <div className="admin-content"><div className="admin-title-row"><h1>Tổng quan kinh doanh</h1><div className="admin-date"><IconCalendar size={16} stroke={1.5} />19/10 – 25/10/2026</div></div>
      <div className="admin-metrics" data-node-id="45:2299">{metrics.map(([label, value, change, Icon]) => <div className="admin-metric" key={label}><div className="admin-metric-label">{label}<Icon size={17} stroke={1.4} /></div><strong>{value}</strong><div className="admin-comparison"><IconTrendingUp size={13} /><span>{change}</span><small>so với tuần trước</small></div></div>)}</div>
      <div className="admin-grid"><RevenueChart /><section className="admin-panel admin-tasks" data-node-id="45:2373"><div className="admin-panel-heading"><div><h2>Cần xử lý</h2><p>Ưu tiên để vận hành trơn tru hơn.</p></div></div><div className="admin-task-list">{tasks.map(([Icon, title, description, count], index) => <div className="admin-task" key={title}><span className={`admin-task-icon ${index === 0 ? 'urgent' : ''}`}><Icon size={17} stroke={1.5} /></span><div><strong>{title}</strong><small>{description}</small></div><b>{count}</b><IconChevronRight size={14}/></div>)}</div><span className="admin-red-link">Quản lý đơn hàng <IconArrowRight size={14}/></span></section>
        <section className="admin-panel admin-orders" data-node-id="45:2406"><div className="admin-section-heading"><h2>Đơn hàng gần đây</h2><span className="admin-red-link">Xem tất cả <IconArrowUpRight size={14}/></span></div><div className="admin-table-wrap"><table><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Thời gian</th><th>Tổng tiền</th><th>Trạng thái</th><th aria-label="Chi tiết"></th></tr></thead><tbody>{orders.map(([id, customer, time, total, status], index) => <tr key={id}><td className="admin-order-id">{id}</td><td>{customer}</td><td className="admin-muted">{time}</td><td className="admin-total">{total}</td><td><span className={`admin-status ${index < 2 ? 'pending' : ''}`}>{status}</span></td><td><IconChevronRight size={14}/></td></tr>)}</tbody></table></div><div className="admin-table-footer">5 đơn mới nhất trong 214 đơn hàng tuần này</div></section>
        <section className="admin-panel admin-products" data-node-id="45:2465"><div className="admin-section-heading"><h2>Sản phẩm bán chạy</h2><span>Tuần này</span></div><div>{products.map(([image, name, details, count, revenue]) => <div className="admin-product" key={name}><img src={image} alt=""/><div className="admin-product-info"><strong>{name}</strong><small>{details}</small></div><div className="admin-product-sales"><strong>{count} đã bán</strong><small>{revenue}</small></div></div>)}</div><div className="admin-products-footer"><a href="/" className="admin-red-link">Xem tất cả sản phẩm <IconArrowRight size={14}/></a></div></section>
      </div><p className="admin-updated">Cập nhật lần cuối lúc 23:59, 25/10/2026 • Múi giờ Việt Nam (GMT+7)</p>
    </div></main></div>;
}
