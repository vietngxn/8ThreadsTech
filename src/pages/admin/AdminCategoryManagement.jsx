import { useMemo, useState } from 'react';
import {
  IconAdjustments, IconChartLine, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconDots, IconEye, IconEyeOff, IconFileText, IconFolder, IconHelpCircle,
  IconLayoutDashboard, IconPackage, IconPencil, IconPlus, IconSearch,
  IconSettings, IconShoppingBag, IconTicket, IconUsers, IconX,
} from '@tabler/icons-react';
import logo from '../../assets/thread-logo.png';
import './AdminCategoryManagement.css';

const initialCategories = [
  { id: 1, name: 'Bàn phím cơ', description: 'Trải nghiệm gõ cơ học, đa dạng layout.', slug: 'ban-phim-co', products: 16, published: true },
  { id: 2, name: 'Bàn phím gaming', description: 'Tối ưu tốc độ và trải nghiệm chơi game.', slug: 'ban-phim-gaming', products: 5, published: true },
  { id: 3, name: 'Bàn phím low-profile', description: 'Thiết kế mỏng nhẹ, gọn gàng cho góc làm việc.', slug: 'ban-phim-low-profile', products: 3, published: true },
];

const slugify = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLocaleLowerCase('vi').trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function Sidebar() {
  const items = [
    [IconLayoutDashboard, 'Dashboard', '/admin', '55:461'],
    [IconPackage, 'Sản phẩm', '/admin/products', '55:465'],
    [IconFolder, 'Danh mục', '/admin/categories', '55:469'],
    [IconShoppingBag, 'Đơn hàng', null, '55:473', '12'],
    [IconUsers, 'Khách hàng', null, '55:479'],
    [IconTicket, 'Khuyến mãi', null, '55:483'],
    [IconChartLine, 'Thống kê', null, '55:487'],
    [IconFileText, 'Nhật kí', null, '55:491'],
  ];

  return <aside className="cm-sidebar" data-node-id="55:455">
    <a className="cm-brand" href="/admin" data-node-id="55:456"><img src={logo} alt="" /><strong>8ThreadTech</strong></a>
    <nav aria-label="Quản lý cửa hàng"><span className="cm-nav-label">QUẢN LÝ</span>
      {items.map(([Icon, label, href, nodeId, count]) => {
        const active = label === 'Danh mục';
        const content = <><Icon size={18} stroke={1.5} /><span>{label}</span>{count && <b>{count}</b>}</>;
        return href ? <a key={label} className={`cm-nav-item${active ? ' active' : ''}`} href={href} aria-current={active ? 'page' : undefined} data-node-id={nodeId}>{content}</a> : <div key={label} className="cm-nav-item" data-node-id={nodeId}>{content}</div>;
      })}
    </nav>
    <div className="cm-sidebar-bottom">
      <div className="cm-support"><IconHelpCircle size={18} />Trung tâm trợ giúp</div>
      <div className="cm-support"><IconSettings size={18} />Cài đặt</div>
      <div className="cm-account"><span className="cm-avatar">MA</span><span><strong>Minh Anh</strong><small>Admin</small></span><IconChevronDown size={14} /></div>
    </div>
  </aside>;
}

function CategoryDialog({ category, onClose, onSave }) {
  const [form, setForm] = useState(category || { name: '', description: '', slug: '', products: 0, published: true });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    onSave({ ...form, name: form.name.trim(), description: form.description.trim(), slug: (form.slug || slugify(form.name)).trim() });
  };

  return <div className="cm-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <form className="cm-dialog" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="cm-dialog-title">
      <div className="cm-dialog-heading"><h2 id="cm-dialog-title">{category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</h2><button type="button" className="cm-icon-button" onClick={onClose} aria-label="Đóng"><IconX size={18} /></button></div>
      <label>Tên danh mục<input required autoFocus maxLength={80} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value, slug: current.slug === slugify(current.name) || !current.slug ? slugify(event.target.value) : current.slug }))} placeholder="Ví dụ: Bàn phím cơ" /></label>
      <label>Đường dẫn<input required maxLength={100} value={form.slug} onChange={update('slug')} placeholder="ban-phim-co" /></label>
      <label>Mô tả<textarea rows="3" maxLength={180} value={form.description} onChange={update('description')} placeholder="Mô tả ngắn về danh mục" /></label>
      <div className="cm-dialog-actions"><button type="button" className="cm-button secondary" onClick={onClose}>Hủy</button><button className="cm-button primary" type="submit">{category ? 'Lưu thay đổi' : 'Thêm danh mục'}</button></div>
    </form>
  </div>;
}

export default function AdminCategoryManagement() {
  const [categories, setCategories] = useState(initialCategories);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('name-asc');
  const [tab, setTab] = useState('all');
  const [dialogCategory, setDialogCategory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [notice, setNotice] = useState('');

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('vi');
    return categories.filter((category) => {
      const matchesText = `${category.name} ${category.slug}`.toLocaleLowerCase('vi').includes(normalized);
      const matchesStatus = status === 'all' || (status === 'published' ? category.published : !category.published);
      const matchesTab = tab === 'all' || (tab === 'published' ? category.published : !category.published);
      return matchesText && matchesStatus && matchesTab;
    }).sort((a, b) => sort === 'name-desc' ? b.name.localeCompare(a.name, 'vi') : a.name.localeCompare(b.name, 'vi'));
  }, [categories, query, status, sort, tab]);

  const pageCount = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const counts = {
    all: categories.length,
    published: categories.filter((category) => category.published).length,
    hidden: categories.filter((category) => !category.published).length,
  };
  const stats = [
    { label: 'Tổng danh mục', value: categories.length, note: 'Cơ · Gaming · Low-profile', Icon: IconFolder, nodeId: '55:526' },
    { label: 'Đang hiển thị', value: counts.published, note: 'Hiển thị trên cửa hàng', Icon: IconEye, nodeId: '55:532' },
    { label: 'Đang ẩn', value: counts.hidden, note: counts.hidden ? 'Không hiển thị trên cửa hàng' : 'Không có danh mục bị ẩn', Icon: IconEyeOff, nodeId: '55:538' },
    { label: 'Tổng sản phẩm', value: categories.reduce((total, category) => total + category.products, 0), note: `${categories.reduce((total, category) => total + category.products, 0)} sản phẩm đã xuất bản`, Icon: IconPackage, nodeId: '55:544' },
  ];

  const saveCategory = (category) => {
    if (category.id) {
      setCategories((current) => current.map((item) => item.id === category.id ? { ...item, ...category } : item));
      setNotice('Đã cập nhật danh mục.');
    } else {
      setCategories((current) => [...current, { ...category, id: Date.now(), products: 0, published: true }]);
      setNotice('Đã thêm danh mục mới.');
    }
    setDialogOpen(false);
  };

  const toggleVisibility = (category) => {
    setCategories((current) => current.map((item) => item.id === category.id ? { ...item, published: !item.published } : item));
    setActiveMenu(null);
    setNotice(category.published ? 'Đã ẩn danh mục.' : 'Đã hiển thị danh mục.');
  };

  const toggleSelected = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const allVisibleSelected = visibleCategories.length > 0 && visibleCategories.every((category) => selectedIds.includes(category.id));
  const toggleAllVisible = () => setSelectedIds((current) => allVisibleSelected ? current.filter((id) => !visibleCategories.some((category) => category.id === id)) : [...new Set([...current, ...visibleCategories.map((category) => category.id)])]);

  return <div className="cm-dashboard" data-node-id="55:454"><Sidebar /><main className="cm-main" data-node-id="55:511">
    <header className="cm-topbar" data-node-id="55:512"><span>8ThreadTech</span><span className="cm-slash">/</span><strong>Danh mục</strong></header>
    <div className="cm-content" data-node-id="55:516">
      <section className="cm-overview" data-node-id="55:517">
        <div className="cm-title-row" data-node-id="55:518"><h1 data-node-id="55:520">Quản lý danh mục</h1><button className="cm-button primary" onClick={() => { setDialogCategory(null); setDialogOpen(true); }} data-node-id="55:522"><IconPlus size={17} />Thêm danh mục</button></div>
        <div className="cm-stats" aria-label="Tổng quan danh mục" data-node-id="55:525">{stats.map(({ label, value, note, Icon, nodeId }) => <article className="cm-stat" key={label} data-node-id={nodeId}><div className="cm-stat-label"><span>{label}</span><Icon size={16} stroke={1.5} /></div><strong>{value}</strong><small>{note}</small></article>)}</div>
      </section>
      <section className="cm-table-panel" aria-label="Danh sách danh mục" data-node-id="55:550">
        <div className="cm-tabs" data-node-id="55:551" role="tablist" aria-label="Lọc theo trạng thái">{[['all', 'Tất cả'], ['published', 'Đang hiển thị'], ['hidden', 'Đang ẩn']].map(([key, label]) => <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? 'selected' : ''} onClick={() => { setTab(key); setPage(1); }}><span>{label}</span><b>{counts[key]}</b></button>)}<span className="cm-column-label"><IconAdjustments size={14} />Tùy chỉnh cột</span></div>
        <div className="cm-filters" data-node-id="55:568"><label className="cm-search" data-node-id="55:569"><IconSearch size={16} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm theo tên danh mục hoặc đường dẫn..." aria-label="Tìm danh mục" /></label>
          <label><span className="sr-only">Lọc trạng thái</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">Tất cả trạng thái</option><option value="published">Đang hiển thị</option><option value="hidden">Đang ẩn</option></select><IconChevronDown size={14} /></label>
          <label><span className="sr-only">Sắp xếp danh mục</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name-asc">Sắp xếp: Tên A–Z</option><option value="name-desc">Sắp xếp: Tên Z–A</option></select><IconChevronDown size={14} /></label>
        </div>
        <div className="cm-table-scroll"><table className="cm-table"><colgroup><col className="cm-check-col" /><col className="cm-name-col" /><col className="cm-slug-col" /><col className="cm-products-col" /><col className="cm-status-col" /><col className="cm-actions-col" /></colgroup><thead data-node-id="55:578"><tr><th className="cm-check-cell"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} aria-label="Chọn tất cả danh mục" /></th><th>Tên danh mục</th><th>Đường dẫn</th><th className="align-right">Số sản phẩm</th><th>Trạng thái</th><th className="align-right">Thao tác</th></tr></thead><tbody>
          {visibleCategories.map((category, index) => <tr key={category.id} data-node-id={category.id <= 3 ? ['55:585', '55:606', '55:627'][category.id - 1] : undefined}><td className="cm-check-cell"><input type="checkbox" checked={selectedIds.includes(category.id)} onChange={() => toggleSelected(category.id)} aria-label={`Chọn ${category.name}`} /></td><td><div className="cm-category-cell"><span className="cm-category-icon"><IconFolder size={20} stroke={1.5} /></span><span className="cm-category-copy"><strong>{category.name}</strong><small>{category.description || 'Chưa có mô tả'}</small></span></div></td><td className="cm-muted">{category.slug}</td><td className="align-right cm-product-count"><strong>{category.products}</strong><small>Đã xuất bản</small></td><td><span className={`cm-status${category.published ? '' : ' hidden'}`}><i />{category.published ? 'Đang hiển thị' : 'Đang ẩn'}</span></td><td><div className="cm-row-actions"><button className="cm-edit-button" onClick={() => { setDialogCategory(category); setDialogOpen(true); }} aria-label={`Sửa ${category.name}`}><IconPencil size={14} />Sửa</button><div className="cm-menu-wrap"><button className="cm-icon-button" onClick={() => setActiveMenu(activeMenu === category.id ? null : category.id)} aria-label={`Tùy chọn ${category.name}`} aria-haspopup="menu" aria-expanded={activeMenu === category.id}><IconDots size={17} /></button>{activeMenu === category.id && <div className="cm-row-menu" role="menu"><button role="menuitem" onClick={() => toggleVisibility(category)}>{category.published ? <IconEyeOff size={15} /> : <IconEye size={15} />}{category.published ? 'Ẩn danh mục' : 'Hiển thị danh mục'}</button></div>}</div></div></td></tr>)}
          {!visibleCategories.length && <tr><td colSpan="6" className="cm-empty">Không tìm thấy danh mục phù hợp với bộ lọc.</td></tr>}
        </tbody></table></div>
        <div className="cm-pagination" data-node-id="55:648"><span>Hiển thị {filteredCategories.length ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filteredCategories.length)}` : '0'} trong {filteredCategories.length} danh mục</span><div><label><span className="sr-only">Số danh mục mỗi trang</span><select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option value="10">10 / trang</option><option value="20">20 / trang</option><option value="50">50 / trang</option></select></label><button aria-label="Trang trước" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><IconChevronLeft size={15} /></button><button className="current" aria-current="page">{currentPage}</button><button aria-label="Trang sau" disabled={currentPage >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}><IconChevronRight size={15} /></button></div></div>
      </section>
      <p className="cm-updated" data-node-id="55:658">Cập nhật lần cuối lúc 23:59, 25/10/2026 • Múi giờ Việt Nam (GMT+7)</p>
    </div>
  </main>
  {dialogOpen && <CategoryDialog category={dialogCategory} onClose={() => setDialogOpen(false)} onSave={saveCategory} />}
  {notice && <div className="cm-toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Đóng thông báo"><IconX size={15} /></button></div>}
  </div>;
}
