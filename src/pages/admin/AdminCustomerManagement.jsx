import { useMemo, useState } from 'react';
import {
  IconCalendar, IconChartLine, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconColumns3, IconCrown, IconDots, IconDownload, IconEye, IconFileText, IconFolder,
  IconHelpCircle, IconLayoutDashboard, IconPackage, IconRepeat, IconSearch, IconSettings,
  IconShoppingBag, IconTicket, IconUserPlus, IconUsers, IconX,
} from '@tabler/icons-react';
import logo from '../../assets/thread-logo.png';
import './AdminOrderManagement.css';
import './AdminCustomerManagement.css';

const customers = [
  { id: '#KH-0248', name: 'Nguyễn Hoàng Nam', phone: '0901 234 567', email: 'hoangnam.ng@gmail.com', orders: 8, spend: 15680000, status: 'Hoạt động', lastPurchase: '25/10/2026', lastOrder: '#8TT-1024' },
  { id: '#KH-0247', name: 'Trần Minh Thư', phone: '0938 456 789', email: 'minhthu.tran@gmail.com', orders: 1, spend: 1890000, status: 'Hoạt động', lastPurchase: '25/10/2026', lastOrder: '#8TT-1023' },
  { id: '#KH-0236', name: 'Lê Đức Anh', phone: '0987 123 456', email: 'ducanh.le@gmail.com', orders: 5, spend: 10450000, status: 'Hoạt động', lastPurchase: '25/10/2026', lastOrder: '#8TT-1022' },
  { id: '#KH-0231', name: 'Phạm Ngọc Linh', phone: '0912 678 345', email: 'ngoclinh.pham@gmail.com', orders: 3, spend: 4270000, status: 'Hoạt động', lastPurchase: '25/10/2026', lastOrder: '#8TT-1021' },
  { id: '#KH-0228', name: 'Võ Thanh Tùng', phone: '0976 543 210', email: 'thanhtung.vo@gmail.com', orders: 4, spend: 6380000, status: 'Hoạt động', lastPurchase: '25/10/2026', lastOrder: '#8TT-1020' },
  { id: '#KH-0225', name: 'Đặng Gia Huy', phone: '0903 876 543', email: 'giahuy.dang@gmail.com', orders: 2, spend: 5930000, status: 'Hoạt động', lastPurchase: '24/10/2026', lastOrder: '#8TT-1019' },
  { id: '#KH-0221', name: 'Bùi Thảo Vy', phone: '0945 321 678', email: 'thaovy.bui@gmail.com', orders: 1, spend: 350000, status: 'Hoạt động', lastPurchase: '24/10/2026', lastOrder: '#8TT-1018' },
  { id: '#KH-0219', name: 'Đỗ Quang Minh', phone: '0968 234 901', email: 'quangminh.do@gmail.com', orders: 2, spend: 2490000, status: 'Đã khóa', lastPurchase: '24/10/2026', lastOrder: '#8TT-1017' },
  { id: '#KH-0216', name: 'Ngô Hải Yến', phone: '0923 567 890', email: 'haiyen.ngo@gmail.com', orders: 3, spend: 4920000, status: 'Hoạt động', lastPurchase: '24/10/2026', lastOrder: '#8TT-1016' },
];

const formatPrice = (price) => `${price.toLocaleString('vi-VN')} ₫`;

function CustomerSidebar() {
  const items = [
    [IconLayoutDashboard, 'Tổng quan', '/admin'], [IconPackage, 'Sản phẩm', '/admin/products'],
    [IconFolder, 'Danh mục', '/admin/categories'], [IconShoppingBag, 'Đơn hàng', '/admin/orders'],
    [IconUsers, 'Khách hàng', '/admin/customers'], [IconTicket, 'Khuyến mãi'],
    [IconChartLine, 'Thống kê'], [IconFileText, 'Nhật kí'],
  ];
  return <aside className="om-sidebar" data-node-id="60:949">
    <a className="om-brand" href="/admin" data-node-id="60:950"><img src={logo} alt="" /><strong>8ThreadTech</strong></a>
    <nav aria-label="Quản lý cửa hàng"><span className="om-nav-label">QUẢN LÝ</span>
      {items.map(([Icon, label, href]) => {
        const active = label === 'Khách hàng';
        const content = <><Icon size={18} stroke={1.5} /><span>{label}</span>{label === 'Đơn hàng' && <b>12</b>}</>;
        return href ? <a key={label} className={`om-nav-item${active ? ' active' : ''}`} href={href} aria-current={active ? 'page' : undefined}>{content}</a> : <div key={label} className="om-nav-item">{content}</div>;
      })}
    </nav>
    <div className="om-sidebar-bottom"><div className="om-support"><IconHelpCircle size={18} />Trung tâm trợ giúp</div><div className="om-support"><IconSettings size={18} />Cài đặt</div>
      <div className="om-account"><span className="om-avatar">MA</span><span><strong>Minh Anh</strong><small>Quản trị viên</small></span><IconChevronDown size={14} /></div>
    </div>
  </aside>;
}

function CustomerDialog({ customer, onClose }) {
  return <div className="om-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="om-dialog" role="dialog" aria-modal="true" aria-labelledby="cm-dialog-title">
      <div className="om-dialog-heading"><div><span>CHI TIẾT KHÁCH HÀNG</span><h2 id="cm-dialog-title">{customer.name}</h2></div><button className="om-icon-button" onClick={onClose} aria-label="Đóng"><IconX size={18} /></button></div>
      <div className="cm-detail-grid"><div><span>Mã khách hàng</span><strong>{customer.id}</strong></div><div><span>Trạng thái</span><strong>{customer.status}</strong></div><div><span>Số điện thoại</span><strong>{customer.phone}</strong></div><div><span>Email</span><strong>{customer.email}</strong></div><div><span>Số đơn hàng</span><strong>{customer.orders}</strong></div><div><span>Tổng chi tiêu</span><strong>{formatPrice(customer.spend)}</strong></div><div><span>Mua gần nhất</span><strong>{customer.lastPurchase} · {customer.lastOrder}</strong></div></div>
      <div className="om-dialog-actions"><button className="om-button" onClick={onClose}>Đóng</button></div>
    </section>
  </div>;
}

export default function AdminCustomerManagement() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [date, setDate] = useState('all');
  const [sort, setSort] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [notice, setNotice] = useState('');

  const filteredCustomers = useMemo(() => customers.filter((customer) => {
    const needle = query.trim().toLocaleLowerCase('vi');
    const matchesQuery = `${customer.id} ${customer.name} ${customer.phone} ${customer.email}`.toLocaleLowerCase('vi').includes(needle);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesTab = activeTab === 'all' || customer.status === 'Đã khóa';
    const matchesDate = date === 'all' || customer.lastPurchase === date;
    return matchesQuery && matchesStatus && matchesTab && matchesDate;
  }).sort((a, b) => sort === 'oldest' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)), [query, statusFilter, activeTab, date, sort]);

  const toggleAll = () => {
    const visibleIds = filteredCustomers.map((customer) => customer.id);
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])]);
  };
  const toggleCustomer = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const exportCsv = () => {
    const selected = selectedIds.length ? customers.filter((customer) => selectedIds.includes(customer.id)) : filteredCustomers;
    const rows = [['Mã khách hàng', 'Họ tên', 'Số điện thoại', 'Email', 'Số đơn hàng', 'Tổng chi tiêu', 'Trạng thái', 'Mua gần nhất'], ...selected.map((customer) => [customer.id, customer.name, customer.phone, customer.email, customer.orders, customer.spend, customer.status, customer.lastPurchase])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = '8threadtech-khach-hang.csv'; link.click(); URL.revokeObjectURL(url);
    setNotice(`Đã xuất ${selected.length} khách hàng.`);
  };

  const stats = [
    { label: 'Tổng khách hàng', value: '1.248', note: 'Khách hàng đã đăng ký tại cửa hàng', Icon: IconUsers },
    { label: 'Khách hàng mới', value: '86', note: '+18,6% so với tháng trước', Icon: IconUserPlus, alert: true },
    { label: 'Khách hàng quay lại', value: '324', note: 'Chiếm 26% tổng khách hàng', Icon: IconRepeat },
    { label: 'Khách hàng VIP', value: '48', note: 'Tổng chi tiêu từ 10.000.000 ₫', Icon: IconCrown },
  ];

  return <div className="om-dashboard cm-dashboard" data-node-id="60:948"><CustomerSidebar /><main className="om-main">
    <header className="om-topbar" data-node-id="60:1008"><span>8ThreadTech</span><span className="om-slash">/</span><strong>Khách hàng</strong></header>
    <div className="om-content cm-content" data-node-id="60:1012">
      <section className="om-overview" data-node-id="60:1013">
        <div className="om-title-row" data-node-id="60:1014"><h1 data-node-id="60:1016">Quản lý khách hàng</h1><button className="om-button" onClick={exportCsv} data-node-id="60:1018"><IconDownload size={16} />Xuất danh sách</button></div>
        <div className="om-stats" data-node-id="60:1025">{stats.map(({ label, value, note, Icon, alert }, index) => <article className="om-stat" key={label} data-node-id={['60:1026', '60:1032', '60:1038', '60:1044'][index]}><div className="om-stat-label"><span>{label}</span><Icon size={17} stroke={1.5} /></div><strong>{value}</strong><small className={alert ? 'alert' : ''}>{note}</small></article>)}</div>
      </section>
      <section className="cm-table-panel" aria-label="Danh sách khách hàng" data-node-id="60:1050">
        <div className="cm-tabs" role="tablist" aria-label="Nhóm khách hàng" data-node-id="60:1051"><button role="tab" aria-selected={activeTab === 'all'} className={activeTab === 'all' ? 'selected' : ''} onClick={() => setActiveTab('all')} data-node-id="60:1053">Tất cả<span>1.248</span></button><button role="tab" aria-selected={activeTab === 'locked'} className={activeTab === 'locked' ? 'selected' : ''} onClick={() => setActiveTab('locked')} data-node-id="60:1069">Đã khóa<span>12</span></button><span className="cm-column-label" data-node-id="60:1073"><IconColumns3 size={14} />Tùy chỉnh cột</span></div>
        <div className="cm-filters" data-node-id="60:1076"><label className="cm-search" data-node-id="60:1077"><IconSearch size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, mã khách hàng, email hoặc SĐT..." aria-label="Tìm khách hàng" /></label>
          <label data-node-id="60:1080"><span className="sr-only">Trạng thái</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Tất cả trạng thái</option><option>Hoạt động</option><option>Đã khóa</option></select><IconChevronDown size={14} /></label>
          <label data-node-id="60:1083"><IconCalendar size={15} /><span className="sr-only">Ngày tạo</span><select value={date} onChange={(event) => setDate(event.target.value)}><option value="all">Ngày tạo: Tất cả</option><option>25/10/2026</option><option>24/10/2026</option></select><IconChevronDown size={14} /></label>
          <label data-node-id="60:1087"><span className="sr-only">Sắp xếp</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Sắp xếp: Mới nhất</option><option value="oldest">Sắp xếp: Cũ nhất</option></select><IconChevronDown size={14} /></label>
        </div>
        <div className="cm-table-scroll"><table className="cm-table"><thead data-node-id="60:1090"><tr><th className="cm-check-cell"><input type="checkbox" aria-label="Chọn tất cả khách hàng" checked={filteredCustomers.length > 0 && filteredCustomers.every((customer) => selectedIds.includes(customer.id))} onChange={toggleAll} /></th><th>Khách hàng</th><th>Thông tin liên hệ</th><th className="align-right">Số đơn</th><th className="align-right">Tổng chi tiêu</th><th>Trạng thái</th><th>Mua gần nhất ↓</th><th className="align-right">Thao tác</th></tr></thead><tbody>
          {filteredCustomers.map((customer, index) => <tr key={customer.id} data-node-id={['60:1100', '60:1124', '60:1147', '60:1171', '60:1194', '60:1217', '60:1240', '60:1263', '60:1286'][index]}><td className="cm-check-cell"><input type="checkbox" aria-label={`Chọn ${customer.name}`} checked={selectedIds.includes(customer.id)} onChange={() => toggleCustomer(customer.id)} /></td><td><div className="cm-customer-cell"><strong>{customer.name}</strong><small>{customer.id}</small></div></td><td><div className="cm-contact-cell"><span>{customer.phone}</span><small>{customer.email}</small></div></td><td className="align-right">{customer.orders}</td><td className="align-right cm-spend">{formatPrice(customer.spend)}</td><td><span className={`cm-badge ${customer.status === 'Đã khóa' ? 'locked' : ''}`}><i />{customer.status}</span></td><td><div className="cm-date-cell"><span>{customer.lastPurchase}</span><small>{customer.lastOrder}</small></div></td><td><div className="om-row-actions"><button className="om-icon-button" aria-label={`Xem ${customer.name}`} onClick={() => setSelectedCustomer(customer)}><IconEye size={16} /></button><button className="om-icon-button" aria-label={`Thao tác ${customer.name}`} onClick={() => setSelectedCustomer(customer)}><IconDots size={17} /></button></div></td></tr>)}
          {!filteredCustomers.length && <tr><td colSpan="8" className="cm-empty">Không tìm thấy khách hàng phù hợp với bộ lọc.</td></tr>}
        </tbody></table></div>
        <div className="cm-pagination" data-node-id="60:1309"><span>Hiển thị {filteredCustomers.length ? `1–${filteredCustomers.length}` : '0'} trong 1.248 khách hàng</span><div><small>9 / trang <IconChevronDown size={12} /></small><button aria-label="Trang trước" disabled><IconChevronLeft size={15} /></button><button className="current" aria-current="page">1</button><button disabled>2</button><button disabled>3</button><button disabled className="cm-ellipsis">…</button><button disabled>139</button><button disabled className="cm-next">Trang sau <IconChevronRight size={14} /></button></div></div>
      </section>
      <p className="om-updated">Cập nhật lần cuối lúc 23:59, 25/10/2026 • Múi giờ Việt Nam (GMT+7)</p>
    </div>
  </main>
  {selectedCustomer && <CustomerDialog customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
  {notice && <div className="om-toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Đóng thông báo"><IconX size={15} /></button></div>}
  </div>;
}
