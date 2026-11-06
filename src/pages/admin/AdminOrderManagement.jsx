import { useMemo, useState } from 'react';
import {
  IconAdjustments, IconChartLine, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconClockHour3, IconColumns3, IconDots, IconDownload, IconEye, IconFileText,
  IconFolder, IconHelpCircle, IconLayoutDashboard, IconPackage, IconSearch,
  IconSettings, IconShoppingBag, IconTicket, IconTruck, IconUsers, IconWallet, IconX,
} from '@tabler/icons-react';
import logo from '../../assets/thread-logo.png';
import './AdminOrderManagement.css';

const orders = [
  { id: '#8TT-1024', product: 'THREAD 75 · 2 sản phẩm', customer: 'Nguyễn Hoàng Nam', phone: '0901 234 567', amount: 2890000, payment: 'Đã thanh toán', method: 'Chuyển khoản', delivery: 'Chờ xác nhận', date: '25/10/2026', time: '22:48' },
  { id: '#8TT-1023', product: 'THREAD 65 · 1 sản phẩm', customer: 'Trần Minh Thư', phone: '0938 456 789', amount: 1890000, payment: 'Chưa thu', method: 'Thu hộ khi nhận', delivery: 'Chờ xác nhận', date: '25/10/2026', time: '21:35' },
  { id: '#8TT-1022', product: 'THREAD 80 PRO · 1 sản phẩm', customer: 'Lê Đức Anh', phone: '0987 123 456', amount: 3290000, payment: 'Đã thanh toán', method: 'Chuyển khoản', delivery: 'Đang xử lý', date: '25/10/2026', time: '20:12' },
  { id: '#8TT-1021', product: 'Bộ keycap PBT · 2 sản phẩm', customer: 'Phạm Ngọc Linh', phone: '0912 678 345', amount: 790000, payment: 'Chưa thu', method: 'Thu hộ khi nhận', delivery: 'Đang giao', date: '25/10/2026', time: '18:46' },
  { id: '#8TT-1020', product: 'THREAD 98 · 1 sản phẩm', customer: 'Võ Thanh Tùng', phone: '0976 543 210', amount: 2190000, payment: 'Đã thanh toán', method: 'Ví MoMo', delivery: 'Đang giao', date: '25/10/2026', time: '16:08' },
  { id: '#8TT-1019', product: 'THREAD 60 HE · 2 sản phẩm', customer: 'Đặng Gia Huy', phone: '0903 876 543', amount: 3140000, payment: 'Đã thanh toán', method: 'Chuyển khoản', delivery: 'Đã giao', date: '24/10/2026', time: '15:24' },
  { id: '#8TT-1018', product: 'Cáp cuộn USB-C · 1 sản phẩm', customer: 'Bùi Thảo Vy', phone: '0945 321 678', amount: 350000, payment: 'Đã thanh toán', method: 'Thu hộ khi nhận', delivery: 'Đã giao', date: '24/10/2026', time: '11:42' },
  { id: '#8TT-1017', product: 'THREAD 75 AIR · 1 sản phẩm', customer: 'Đỗ Quang Minh', phone: '0968 234 901', amount: 1990000, payment: 'Đã hoàn tiền', method: 'Chuyển khoản', delivery: 'Đã hủy', date: '24/10/2026', time: '10:17' },
  { id: '#8TT-1016', product: 'THREAD 65 LITE · 2 sản phẩm', customer: 'Ngô Hải Yến', phone: '0923 567 890', amount: 1640000, payment: 'Đã thanh toán', method: 'Ví MoMo', delivery: 'Đã giao', date: '24/10/2026', time: '09:05' },
];

const tabs = [
  ['all', 'Tất cả', 124], ['Chờ xác nhận', 'Chờ xác nhận', 12], ['Đang xử lý', 'Đang xử lý', 18],
  ['Đang giao', 'Đang giao', 26], ['Đã giao', 'Đã giao', 64], ['Đã hủy', 'Đã hủy', 4],
];
const formatPrice = (price) => `${price.toLocaleString('vi-VN')} ₫`;

function Sidebar() {
  const items = [
    [IconLayoutDashboard, 'Tổng quan', '/admin'], [IconPackage, 'Sản phẩm', '/admin/products'],
    [IconFolder, 'Danh mục', '/admin/categories'], [IconShoppingBag, 'Đơn hàng', '/admin/orders'],
    [IconUsers, 'Khách hàng'], [IconTicket, 'Khuyến mãi'], [IconChartLine, 'Thống kê'], [IconFileText, 'Nhật kí'],
  ];
  return <aside className="om-sidebar" data-node-id="58:481">
    <a className="om-brand" href="/admin" data-node-id="58:482"><img src={logo} alt="" /><strong>8ThreadTech</strong></a>
    <nav aria-label="Quản lý cửa hàng"><span className="om-nav-label">QUẢN LÝ</span>
      {items.map(([Icon, label, href]) => {
        const active = label === 'Đơn hàng';
        const content = <><Icon size={18} stroke={1.5} /><span>{label}</span>{active && <b>12</b>}</>;
        return href ? <a key={label} className={`om-nav-item${active ? ' active' : ''}`} href={href} aria-current={active ? 'page' : undefined}>{content}</a> : <div key={label} className="om-nav-item">{content}</div>;
      })}
    </nav>
    <div className="om-sidebar-bottom"><div className="om-support"><IconHelpCircle size={18} />Trung tâm trợ giúp</div><div className="om-support"><IconSettings size={18} />Cài đặt</div>
      <div className="om-account"><span className="om-avatar">MA</span><span><strong>Minh Anh</strong><small>Quản trị viên</small></span><IconChevronDown size={14} /></div>
    </div>
  </aside>;
}

function StatusBadge({ value, type }) {
  const statusClass = value === 'Đã thanh toán' || value === 'Đã giao' ? 'success'
    : value === 'Đang xử lý' || value === 'Đang giao' ? 'info'
      : value === 'Đã hủy' || value === 'Đã hoàn tiền' ? 'danger' : 'pending';
  return <span className={`om-badge ${statusClass}`} data-type={type}><i />{value}</span>;
}

function OrderDialog({ order, onClose }) {
  return <div className="om-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="om-dialog" role="dialog" aria-modal="true" aria-labelledby="om-dialog-title">
      <div className="om-dialog-heading"><div><span>CHI TIẾT ĐƠN HÀNG</span><h2 id="om-dialog-title">{order.id}</h2></div><button className="om-icon-button" onClick={onClose} aria-label="Đóng"><IconX size={18} /></button></div>
      <div className="om-detail-grid"><div><span>Khách hàng</span><strong>{order.customer}</strong><small>{order.phone}</small></div><div><span>Ngày đặt</span><strong>{order.date} · {order.time}</strong></div><div><span>Thanh toán</span><StatusBadge value={order.payment} /></div><div><span>Giao hàng</span><StatusBadge value={order.delivery} /></div></div>
      <div className="om-detail-product"><span>Sản phẩm</span><strong>{order.product}</strong><strong>{formatPrice(order.amount)}</strong></div>
      <div className="om-detail-total"><span>Tổng thanh toán</span><strong>{formatPrice(order.amount)}</strong></div>
      <div className="om-dialog-actions"><button className="om-button" onClick={onClose}>Đóng</button></div>
    </section>
  </div>;
}

export default function AdminOrderManagement() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [payment, setPayment] = useState('all');
  const [date, setDate] = useState('all');
  const [sort, setSort] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notice, setNotice] = useState('');

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const needle = query.trim().toLocaleLowerCase('vi');
    const matchesQuery = `${order.id} ${order.customer} ${order.phone} ${order.product}`.toLocaleLowerCase('vi').includes(needle);
    const matchesStatus = activeTab === 'all' || order.delivery === activeTab;
    const matchesPayment = payment === 'all' || (payment === 'paid' ? order.payment === 'Đã thanh toán' : order.payment === 'Chưa thu');
    const matchesDate = date === 'all' || order.date === date;
    return matchesQuery && matchesStatus && matchesPayment && matchesDate;
  }).sort((a, b) => sort === 'oldest' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)), [query, activeTab, payment, date, sort]);

  const toggleAll = () => {
    const visibleIds = filteredOrders.map((order) => order.id);
    const allVisibleSelected = visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => allVisibleSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : [...new Set([...current, ...visibleIds])]);
  };
  const toggleOrder = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const exportCsv = () => {
    const selected = selectedIds.length ? orders.filter((order) => selectedIds.includes(order.id)) : filteredOrders;
    const rows = [['Mã đơn', 'Khách hàng', 'Số điện thoại', 'Sản phẩm', 'Giá trị', 'Thanh toán', 'Giao hàng', 'Ngày đặt'], ...selected.map((order) => [order.id, order.customer, order.phone, order.product, order.amount, order.payment, order.delivery, order.date])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = '8threadtech-don-hang.csv'; link.click(); URL.revokeObjectURL(url);
    setNotice(`Đã xuất ${selected.length} đơn hàng.`);
  };

  const stats = [
    { label: 'Tổng đơn hàng', value: '124', note: '01/10 – 25/10/2026', Icon: IconShoppingBag },
    { label: 'Chờ xác nhận', value: '12', note: 'Cần xác nhận để xử lý đơn', Icon: IconClockHour3, alert: true },
    { label: 'Đang giao hàng', value: '26', note: 'Đã bàn giao cho vận chuyển', Icon: IconTruck },
    { label: 'Doanh thu đã thu', value: '186.420.000 ₫', note: 'Từ các đơn đã thanh toán', Icon: IconWallet },
  ];

  return <div className="om-dashboard" data-node-id="58:480"><Sidebar /><main className="om-main">
    <header className="om-topbar" data-node-id="58:540"><span>8ThreadTech</span><span className="om-slash">/</span><strong>Đơn hàng</strong></header>
    <div className="om-content" data-node-id="58:544">
      <section className="om-overview" data-node-id="58:545">
        <div className="om-title-row" data-node-id="58:546"><h1 data-node-id="58:548">Quản lý đơn hàng</h1><button className="om-button" onClick={exportCsv} data-node-id="58:550"><IconDownload size={16} />Xuất đơn hàng</button></div>
        <div className="om-stats" data-node-id="58:557">{stats.map(({ label, value, note, Icon, alert }, index) => <article className="om-stat" key={label} data-node-id={['58:558', '58:564', '58:570', '58:576'][index]}><div className="om-stat-label"><span>{label}</span><Icon size={17} stroke={1.5} /></div><strong>{value}</strong><small className={alert ? 'alert' : ''}>{note}</small></article>)}</div>
      </section>
      <section className="om-table-panel" aria-label="Danh sách đơn hàng" data-node-id="58:582">
        <div className="om-tabs" role="tablist" aria-label="Lọc theo trạng thái" data-node-id="58:583">{tabs.map(([key, label, count], index) => <button key={key} role="tab" aria-selected={activeTab === key} className={activeTab === key ? 'selected' : ''} onClick={() => setActiveTab(key)} data-node-id={['58:585', '58:589', '58:593', '58:597', '58:601', '58:605'][index]}>{label}<span>{count}</span></button>)}<span className="om-column-label"><IconColumns3 size={14} />Tùy chỉnh cột</span></div>
        <div className="om-filters" data-node-id="58:612"><label className="om-search" data-node-id="58:613"><IconSearch size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã đơn, tên hoặc SĐT khách hàng..." aria-label="Tìm đơn hàng" /></label>
          <label><span className="sr-only">Thanh toán</span><select value={payment} onChange={(event) => setPayment(event.target.value)}><option value="all">Tất cả thanh toán</option><option value="paid">Đã thanh toán</option><option value="unpaid">Chưa thu</option></select><IconChevronDown size={14} /></label>
          <label><span className="sr-only">Ngày đặt</span><IconAdjustments size={15} /><select value={date} onChange={(event) => setDate(event.target.value)}><option value="all">01/10 – 25/10/2026</option><option>25/10/2026</option><option>24/10/2026</option></select><IconChevronDown size={14} /></label>
          <label><span className="sr-only">Sắp xếp</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Sắp xếp: Mới nhất</option><option value="oldest">Sắp xếp: Cũ nhất</option></select><IconChevronDown size={14} /></label>
        </div>
        <div className="om-table-scroll"><table className="om-table"><thead data-node-id="58:626"><tr><th className="om-check-cell"><input type="checkbox" aria-label="Chọn tất cả đơn hàng" checked={filteredOrders.length > 0 && filteredOrders.every((order) => selectedIds.includes(order.id))} onChange={toggleAll} /></th><th>Đơn hàng / Sản phẩm</th><th>Khách hàng</th><th className="align-right">Giá trị đơn</th><th>Thanh toán</th><th>Giao hàng</th><th>Ngày đặt ↓</th><th className="align-right">Thao tác</th></tr></thead><tbody>
          {filteredOrders.map((order, index) => <tr key={order.id} data-node-id={['58:635', '58:659', '58:683', '58:707', '58:731', '58:755', '58:779', '58:803', '58:827'][index]}><td className="om-check-cell"><input type="checkbox" aria-label={`Chọn đơn ${order.id}`} checked={selectedIds.includes(order.id)} onChange={() => toggleOrder(order.id)} /></td><td><div className="om-order-cell"><strong>{order.id}</strong><small>{order.product}</small></div></td><td><div className="om-customer-cell"><span>{order.customer}</span><small>{order.phone}</small></div></td><td className="align-right om-amount">{formatPrice(order.amount)}</td><td><div className="om-payment-cell"><StatusBadge value={order.payment} /><small>{order.method}</small></div></td><td><StatusBadge value={order.delivery} /></td><td><div className="om-date-cell"><span>{order.date}</span><small>{order.time}</small></div></td><td><div className="om-row-actions"><button className="om-icon-button" aria-label={`Xem đơn ${order.id}`} onClick={() => setSelectedOrder(order)}><IconEye size={16} /></button><button className="om-icon-button" aria-label={`Thao tác đơn ${order.id}`} onClick={() => { setSelectedOrder(order); }}><IconDots size={17} /></button></div></td></tr>)}
          {!filteredOrders.length && <tr><td colSpan="8" className="om-empty">Không tìm thấy đơn hàng phù hợp với bộ lọc.</td></tr>}
        </tbody></table></div>
        <div className="om-pagination" data-node-id="58:851"><span>Hiển thị {filteredOrders.length ? `1–${filteredOrders.length}` : '0'} trong 124 đơn hàng</span><div><small>9 / trang</small><button aria-label="Trang trước" disabled><IconChevronLeft size={15} /></button><button className="current" aria-current="page">1</button><button disabled>2</button><button disabled>3</button><button disabled className="om-ellipsis">…</button><button disabled>14</button><button disabled className="om-next">Trang sau <IconChevronRight size={14} /></button></div></div>
      </section>
      <p className="om-updated">Cập nhật lần cuối lúc 23:59, 25/10/2026 • Múi giờ Việt Nam (GMT+7)</p>
    </div>
  </main>
  {selectedOrder && <OrderDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
  {notice && <div className="om-toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Đóng thông báo"><IconX size={15} /></button></div>}
  </div>;
}
