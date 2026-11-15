import { Fragment, useMemo, useState } from 'react';
import {
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconSearch,
} from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import './AdminJournal.css';

const activities = [
  { time: '14:32:08', date: '25/10/2026', actor: 'Minh Anh', role: 'Quản trị viên', module: 'Sản phẩm', action: 'Cập nhật thông tin sản phẩm', subject: 'THREAD 75 · SP-0075', ip: '192.168.1.10', status: 'Thành công', details: 'Thay đổi giá bán và mô tả sản phẩm.' },
  { time: '14:28:45', date: '25/10/2026', actor: 'Hoàng Nam', role: 'Nhân viên', module: 'Đơn hàng', action: 'Xác nhận đơn hàng', subject: '#DH-20261025-082', ip: '192.168.1.12', status: 'Thành công', details: 'Đơn hàng được xác nhận và chuyển sang trạng thái chuẩn bị hàng.' },
  { time: '14:25:12', date: '25/10/2026', actor: 'Không xác định', role: 'Khách truy cập', module: 'Bảo mật', action: 'Đăng nhập không thành công', subject: 'Sai mật khẩu · Lần thử thứ 5', ip: '103.28.36.45', status: 'Thất bại', details: 'Đăng nhập bị từ chối sau 5 lần nhập sai mật khẩu.' },
  { time: '14:20:36', date: '25/10/2026', actor: 'Minh Anh', role: 'Quản trị viên', module: 'Khuyến mãi', action: 'Tạo mã giảm giá mới', subject: 'WELCOME10 · Giảm 10%', ip: '192.168.1.10', status: 'Thành công', details: 'Mã giảm giá áp dụng cho đơn hàng từ 500.000 ₫.' },
  { time: '14:15:02', date: '25/10/2026', actor: 'Hệ thống', role: 'Tác vụ tự động', module: 'Kho hàng', action: 'Sản phẩm sắp hết hàng', subject: 'THREAD 80 PRO · Còn 3 sản phẩm', ip: 'Nội bộ', status: 'Cảnh báo', details: 'Tồn kho sản phẩm đã thấp hơn ngưỡng cảnh báo.' },
  { time: '14:10:54', date: '25/10/2026', actor: 'Thu Hà', role: 'Nhân viên', module: 'Khách hàng', action: 'Cập nhật thông tin khách hàng', subject: 'Nguyễn Văn An · KH-0128', ip: '192.168.1.15', status: 'Thành công', details: 'Cập nhật thông tin liên hệ của khách hàng.' },
  { time: '14:05:18', date: '25/10/2026', actor: 'Hoàng Nam', role: 'Nhân viên', module: 'Đơn hàng', action: 'Cập nhật trạng thái vận chuyển', subject: '#DH-20261025-079 · Đang giao', ip: '192.168.1.12', status: 'Thành công', details: 'Trạng thái vận chuyển được cập nhật thành đang giao.' },
  { time: '13:58:40', date: '25/10/2026', actor: 'Minh Anh', role: 'Quản trị viên', module: 'Danh mục', action: 'Thêm danh mục sản phẩm', subject: 'Bàn phím không dây · DM-009', ip: '192.168.1.10', status: 'Thành công', details: 'Danh mục mới được thêm vào cửa hàng.' },
  { time: '13:50:06', date: '25/10/2026', actor: 'Hệ thống', role: 'Tác vụ tự động', module: 'Hệ thống', action: 'Sao lưu dữ liệu hoàn tất', subject: 'backup_20261025_1350.sql', ip: 'Nội bộ', status: 'Thành công', details: 'Bản sao lưu tự động đã hoàn tất.' },
  { time: '13:42:31', date: '25/10/2026', actor: 'Thu Hà', role: 'Nhân viên', module: 'Bảo mật', action: 'Đăng nhập vào trang quản trị', subject: 'Chrome 130 · Windows 11', ip: '192.168.1.15', status: 'Thành công', details: 'Đăng nhập trang quản trị từ thiết bị mới.' },
];

const statusClass = {
  'Thành công': 'success',
  'Cảnh báo': 'warning',
  'Thất bại': 'failure',
};

function saveCsv(rows) {
  const columns = ['Thời gian', 'Người thực hiện', 'Vai trò', 'Phân hệ', 'Hoạt động', 'Mã đối tượng', 'Địa chỉ IP', 'Trạng thái'];
  const csv = [columns, ...rows.map(({ time, date, actor, role, module, action, subject, ip, status }) => [`${time} ${date}`, actor, role, module, action, subject, ip, status])]
    .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nhat-ki-he-thong.csv';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function AdminJournal() {
  const [searchDraft, setSearchDraft] = useState('');
  const [search, setSearch] = useState('');
  const [actorFilter, setActorFilter] = useState('Tất cả');
  const [moduleFilter, setModuleFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [dateRange, setDateRange] = useState('19/10 – 25/10/2026');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const filteredActivities = useMemo(() => activities.filter((item) => {
    const query = search.trim().toLocaleLowerCase('vi');
    const matchesSearch = !query || [item.actor, item.role, item.module, item.action, item.subject, item.ip].some(value => value.toLocaleLowerCase('vi').includes(query));
    const [startDate, endDate] = dateRange.split(' – ').map(value => {
      const [day, month, year] = value.split('/').map(Number);
      return new Date(year, month - 1, day);
    });
    const [day, month, year] = item.date.split('/').map(Number);
    const activityDate = new Date(year, month - 1, day);
    return matchesSearch
      && activityDate >= startDate
      && activityDate <= endDate
      && (actorFilter === 'Tất cả' || item.actor === actorFilter)
      && (moduleFilter === 'Tất cả' || item.module === moduleFilter)
      && (statusFilter === 'Tất cả' || item.status === statusFilter);
  }), [search, actorFilter, moduleFilter, statusFilter, dateRange]);

  const resetFilters = () => {
    setSearchDraft('');
    setSearch('');
    setActorFilter('Tất cả');
    setModuleFilter('Tất cả');
    setStatusFilter('Tất cả');
    setDateRange('19/10 – 25/10/2026');
    setPage(1);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setSearch(searchDraft);
    setPage(1);
  };

  return (
    <div className="journal-dashboard" data-node-id="212:2">
      <AdminSidebar />
      <main className="journal-main" data-node-id="212:61">
        <header className="journal-topbar" data-node-id="212:62">
          <span>8ThreadTech</span><span className="journal-slash">/</span><strong>Nhật kí hệ thống</strong>
        </header>
        <div className="journal-content" data-node-id="212:66">
          <section className="journal-heading" data-node-id="212:369">
            <div>
              <h1 data-node-id="212:375">Nhật kí hệ thống</h1>
              <p>Theo dõi hoạt động, thay đổi dữ liệu và bảo mật của cửa hàng.</p>
            </div>
            <button className="journal-export" type="button" onClick={() => saveCsv(filteredActivities)}>
              <IconDownload size={16} stroke={1.8} />Xuất nhật kí
            </button>
          </section>

          <section className="journal-metrics" aria-label="Chỉ số hoạt động" data-node-id="212:370">
            <article><span>Tổng hoạt động</span><strong>1.248</strong><small>Trong 7 ngày qua</small></article>
            <article><span>Thành công</span><strong className="journal-green">1.206</strong><small>96,6% tổng hoạt động</small></article>
            <article><span>Cảnh báo</span><strong className="journal-amber">34</strong><small>Cần theo dõi</small></article>
            <article><span>Thất bại</span><strong className="journal-red">8</strong><small>Kiểm tra các lần truy cập</small></article>
          </section>

          <section className="journal-filters" aria-label="Bộ lọc nhật kí" data-node-id="212:371">
            <form className="journal-filter-top" onSubmit={submitSearch}>
              <label className="journal-search">
                <IconSearch size={16} aria-hidden="true" />
                <span className="sr-only">Tìm kiếm nhật kí</span>
                <input value={searchDraft} onChange={event => setSearchDraft(event.target.value)} placeholder="Tìm theo người dùng, nội dung, mã đối tượng..." />
              </label>
              <label className="journal-select journal-date-select">
                <IconCalendar size={15} aria-hidden="true" />
                <span className="sr-only">Khoảng thời gian</span>
                <select value={dateRange} onChange={event => setDateRange(event.target.value)}>
                  <option>19/10 – 25/10/2026</option>
                  <option>12/10 – 18/10/2026</option>
                  <option>01/10 – 25/10/2026</option>
                </select>
                <IconChevronDown size={13} aria-hidden="true" />
              </label>
              <button className="journal-filter-button" type="submit">Lọc kết quả</button>
            </form>
            <div className="journal-filter-bottom">
              <label className="journal-select journal-chip"><span>Người dùng:</span><select value={actorFilter} onChange={event => { setActorFilter(event.target.value); setPage(1); }}><option value="Tất cả">Tất cả</option><option>Minh Anh</option><option>Hoàng Nam</option><option>Thu Hà</option><option>Hệ thống</option><option>Không xác định</option></select><IconChevronDown size={12} /></label>
              <label className="journal-select journal-chip"><span>Phân hệ:</span><select value={moduleFilter} onChange={event => { setModuleFilter(event.target.value); setPage(1); }}><option value="Tất cả">Tất cả</option>{['Sản phẩm', 'Đơn hàng', 'Bảo mật', 'Khuyến mãi', 'Kho hàng', 'Khách hàng', 'Danh mục', 'Hệ thống'].map(value => <option key={value}>{value}</option>)}</select><IconChevronDown size={12} /></label>
              <label className="journal-select journal-chip"><span>Trạng thái:</span><select value={statusFilter} onChange={event => { setStatusFilter(event.target.value); setPage(1); }}><option value="Tất cả">Tất cả</option><option>Thành công</option><option>Cảnh báo</option><option>Thất bại</option></select><IconChevronDown size={12} /></label>
              <button className="journal-reset" type="button" onClick={resetFilters}>Đặt lại bộ lọc</button>
              <span className="journal-range-note">7 ngày gần nhất</span>
            </div>
          </section>

          <section className="journal-activity" aria-label="Lịch sử hoạt động" data-node-id="212:372">
            <div className="journal-list-heading" data-node-id="212:417">
              <div><h2>Lịch sử hoạt động</h2><p>{filteredActivities.length === activities.length ? '1.248' : filteredActivities.length} bản ghi • Sắp xếp theo thời gian mới nhất</p></div>
              <span className="journal-recording"><i />Đang ghi nhận hoạt động</span>
            </div>
            <div className="journal-table-scroll">
              <table>
                <thead data-node-id="212:423"><tr><th>Thời gian ↓</th><th>Người thực hiện</th><th>Phân hệ</th><th>Hoạt động</th><th>Địa chỉ IP</th><th>Trạng thái</th><th>Chi tiết</th></tr></thead>
                <tbody>
                  {filteredActivities.length ? filteredActivities.map((item, index) => {
                    const rowId = `${item.time}-${item.actor}`;
                    const expanded = expandedId === rowId;
                    return (
                      <Fragment key={rowId}>
                        <tr className={item.status === 'Thất bại' ? 'journal-failed-row' : ''} data-node-id={index === 0 ? '212:438' : undefined}>
                          <td><span className="journal-primary">{item.time}</span><small>{item.date}</small></td>
                          <td><span className="journal-primary">{item.actor}</span><small>{item.role}</small></td>
                          <td className="journal-module">{item.module}</td>
                          <td><span className="journal-primary">{item.action}</span><small>{item.subject}</small></td>
                          <td className="journal-ip">{item.ip}</td>
                          <td><span className={`journal-status ${statusClass[item.status]}`}><i />{item.status}</span></td>
                          <td><button className="journal-detail-button" type="button" aria-expanded={expanded} onClick={() => setExpandedId(expanded ? null : rowId)}>{expanded ? 'Ẩn' : 'Xem'}</button></td>
                        </tr>
                        {expanded && <tr className="journal-detail-row"><td colSpan="7"><strong>Chi tiết hoạt động</strong><span>{item.details}</span><small>Mã tham chiếu: {item.subject}</small></td></tr>}
                      </Fragment>
                    );
                  }) : <tr><td className="journal-empty" colSpan="7">Không tìm thấy hoạt động phù hợp với bộ lọc.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="journal-pagination" data-node-id="212:628">
              <span>Hiển thị {filteredActivities.length ? `${(page - 1) * 10 + 1}–${(page - 1) * 10 + filteredActivities.length}` : '0'} trong {filteredActivities.length === activities.length ? '1.248' : filteredActivities.length} bản ghi</span>
              <div className="journal-page-controls" aria-label="Phân trang">
                <label className="journal-page-size"><select aria-label="Số bản ghi mỗi trang" defaultValue="10"><option>10</option><option>25</option><option>50</option></select><IconChevronDown size={12} /></label>
                <button type="button" aria-label="Trang trước" disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))}><IconChevronLeft size={14} /></button>
                {[1, 2, 3].map(number => <button type="button" key={number} className={page === number ? 'current' : ''} aria-current={page === number ? 'page' : undefined} onClick={() => setPage(number)}>{number}</button>)}
                <span className="journal-ellipsis">…</span>
                <button type="button" className={page === 125 ? 'current' : ''} aria-current={page === 125 ? 'page' : undefined} onClick={() => setPage(125)}>125</button>
                <button type="button" aria-label="Trang sau" disabled={page === 125} onClick={() => setPage(Math.min(125, page + 1))}><IconChevronRight size={14} /></button>
              </div>
            </div>
          </section>

          <footer className="journal-footer" data-node-id="212:373">
            <span>Nhật kí được lưu trữ trong 90 ngày. Chỉ quản trị viên có quyền xuất dữ liệu.</span>
            <span>Cập nhật lúc 14:32 · 25/10/2026</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
