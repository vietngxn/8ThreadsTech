import { useMemo, useRef, useState } from 'react';
import {
  IconAdjustments, IconChartLine, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconDots, IconDownload, IconEye, IconFileImport, IconFolder, IconHelpCircle,
  IconLayoutDashboard, IconPackage, IconPackages, IconPackageOff, IconPlus,
  IconSearch, IconSettings, IconShoppingBag, IconTicket, IconUsers, IconX,
} from '@tabler/icons-react';
import logo from '../../assets/thread-logo.png';
import thread75 from '../../assets/list-thread-75.png';
import thread65 from '../../assets/list-thread-65.png';
import thread98 from '../../assets/list-thread-98.png';
import thread80Pro from '../../assets/list-thread-80-pro.png';
import thread60He from '../../assets/list-thread-60-he.png';
import thread75Air from '../../assets/list-thread-75-air.png';
import thread65Lite from '../../assets/list-thread-65-lite.png';
import thread87 from '../../assets/list-thread-87.png';
import thread100 from '../../assets/list-thread-100.png';
import './AdminProductManagement.css';

const initialProducts = [
  { id: 1, name: 'THREAD 75', variant: 'Bạc ánh trăng · Linear Red Switch', sku: 'TH-75-SL', category: 'Bàn phím cơ', price: 2490000, stock: 48, image: thread75, published: true },
  { id: 2, name: 'THREAD 65', variant: 'Đen nguyên bản · Linear Switch', sku: 'TH-65-BK', category: 'Bàn phím cơ', price: 1890000, stock: 36, image: thread65, published: true },
  { id: 3, name: 'THREAD 98', variant: 'Trắng sương · Tactile Brown Switch', sku: 'TH-98-WH', category: 'Bàn phím cơ', price: 2190000, stock: 8, image: thread98, published: true },
  { id: 4, name: 'THREAD 80 PRO', variant: 'Xám titan · Linear Silver Switch', sku: 'TH-80P-TI', category: 'Bàn phím gaming', price: 3290000, stock: 21, image: thread80Pro, published: true },
  { id: 5, name: 'THREAD 60 HE', variant: 'Đỏ dung nham · Switch từ tính', sku: 'TH-60H-RD', category: 'Bàn phím gaming', price: 2790000, stock: 6, image: thread60He, published: true },
  { id: 6, name: 'THREAD 75 AIR', variant: 'Xanh khói · Low-profile Switch', sku: 'TH-75A-BL', category: 'Bàn phím low-profile', price: 1990000, stock: 0, image: thread75Air, published: true },
  { id: 7, name: 'THREAD 65 LITE', variant: 'Kem cát · Linear Red Switch', sku: 'TH-65L-CR', category: 'Bàn phím cơ', price: 1290000, stock: 52, image: thread65Lite, published: true },
  { id: 8, name: 'THREAD 87', variant: 'Đen carbon · Tactile Brown Switch', sku: 'TH-87-CB', category: 'Bàn phím cơ', price: 1690000, stock: 29, image: thread87, published: true },
  { id: 9, name: 'THREAD 100', variant: 'Bạc tinh vân · Linear Red Switch', sku: 'TH-100-SL', category: 'Bàn phím cơ', price: 2590000, stock: 18, image: thread100, published: true },
];

const formatPrice = (price) => `${Number(price).toLocaleString('vi-VN')} ₫`;
const stockState = (stock) => stock === 0 ? 'out' : stock < 10 ? 'low' : 'available';

function Sidebar() {
  const items = [
    [IconLayoutDashboard, 'Dashboard', '/admin'], [IconPackage, 'Sản phẩm', '/admin/products'],
    [IconFolder, 'Danh mục'], [IconShoppingBag, 'Đơn hàng', undefined, '12'], [IconUsers, 'Khách hàng'],
    [IconTicket, 'Khuyến mãi'], [IconChartLine, 'Thống kê'], [IconAdjustments, 'Nhật kí'],
  ];
  return <aside className="pm-sidebar" data-node-id="52:490">
    <a className="pm-brand" href="/admin" data-node-id="52:491"><img src={logo} alt="" /><strong>8ThreadTech</strong></a>
    <nav aria-label="Quản lý cửa hàng"><span className="pm-nav-label">QUẢN LÝ</span>
      {items.map(([Icon, label, href, count]) => {
        const active = label === 'Sản phẩm';
        const content = <><Icon size={18} stroke={1.6} /><span>{label}</span>{count && <b>{count}</b>}</>;
        return href ? <a key={label} className={`pm-nav-item${active ? ' active' : ''}`} href={href} aria-current={active ? 'page' : undefined} data-node-id={active ? '52:500' : '52:496'}>{content}</a> : <div key={label} className="pm-nav-item">{content}</div>;
      })}
    </nav>
    <div className="pm-sidebar-bottom">
      <div className="pm-support"><IconHelpCircle size={18} />Trung tâm trợ giúp</div>
      <div className="pm-support"><IconSettings size={18} />Cài đặt</div>
      <div className="pm-account"><span className="pm-avatar">MA</span><span><strong>Minh Anh</strong><small>Admin</small></span><IconChevronDown size={14} /></div>
    </div>
  </aside>;
}

function ProductDialog({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || { name: '', variant: '', sku: '', category: 'Bàn phím cơ', price: '', stock: 0 });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) });
  };
  return <div className="pm-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <form className="pm-dialog" onSubmit={submit} aria-labelledby="pm-dialog-title">
      <div className="pm-dialog-heading"><h2 id="pm-dialog-title">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h2><button type="button" className="pm-icon-button" onClick={onClose} aria-label="Đóng"><IconX size={18} /></button></div>
      <label>Tên sản phẩm<input required value={form.name} onChange={update('name')} placeholder="Ví dụ: THREAD 75" /></label>
      <label>Phiên bản<input value={form.variant} onChange={update('variant')} placeholder="Màu sắc · Loại switch" /></label>
      <div className="pm-form-grid"><label>SKU<input required value={form.sku} onChange={update('sku')} /></label><label>Danh mục<select value={form.category} onChange={update('category')}><option>Bàn phím cơ</option><option>Bàn phím gaming</option><option>Bàn phím low-profile</option></select></label></div>
      <div className="pm-form-grid"><label>Giá bán (₫)<input required type="number" min="0" value={form.price} onChange={update('price')} /></label><label>Tồn kho<input required type="number" min="0" value={form.stock} onChange={update('stock')} /></label></div>
      <div className="pm-dialog-actions"><button type="button" className="pm-button secondary" onClick={onClose}>Hủy</button><button className="pm-button primary" type="submit">{product ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button></div>
    </form>
  </div>;
}

export default function AdminProductManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [tab, setTab] = useState('all');
  const [dialogProduct, setDialogProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const fileInput = useRef(null);

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('vi');
    return products.filter((product) => {
      const matchesText = `${product.name} ${product.sku} ${product.variant}`.toLocaleLowerCase('vi').includes(normalized);
      const stock = stockState(product.stock);
      return matchesText && (category === 'all' || product.category === category)
        && (status === 'all' || (status === 'published' ? product.published : !product.published))
        && (tab === 'all' || stock === tab);
    }).sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : b.id - a.id);
  }, [products, query, category, status, sort, tab]);

  const stats = [
    { label: 'Tổng sản phẩm', value: products.length, note: 'Bàn phím cơ · gaming · low-profile', Icon: IconPackage },
    { label: 'Đang hiển thị', value: products.filter((product) => product.published).length, note: 'Đã xuất bản trên cửa hàng', Icon: IconEye },
    { label: 'Sắp hết hàng', value: products.filter((product) => stockState(product.stock) === 'low').length, note: 'Tồn kho từ 1 đến 9 sản phẩm', Icon: IconPackages, alert: true },
    { label: 'Hết hàng', value: products.filter((product) => product.stock === 0).length, note: 'Cần bổ sung tồn kho', Icon: IconPackageOff, alert: true },
  ];
  const counts = {
    all: products.length,
    available: products.filter((product) => stockState(product.stock) === 'available').length,
    low: products.filter((product) => stockState(product.stock) === 'low').length,
    out: products.filter((product) => stockState(product.stock) === 'out').length,
  };

  const saveProduct = (product) => {
    if (product.id) setProducts((current) => current.map((item) => item.id === product.id ? { ...item, ...product } : item));
    else setProducts((current) => [{ ...product, id: Date.now(), image: thread75, published: false }, ...current]);
    setDialogOpen(false);
    setNotice(product.id ? 'Đã cập nhật sản phẩm.' : 'Đã thêm sản phẩm mới.');
  };

  const exportCsv = () => {
    const rows = [['Tên sản phẩm', 'SKU', 'Danh mục', 'Giá bán', 'Tồn kho', 'Trạng thái'], ...visibleProducts.map((product) => [product.name, product.sku, product.category, product.price, product.stock, product.published ? 'Đang hiển thị' : 'Bản nháp'])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = '8threadtech-san-pham.csv';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Đã xuất danh sách sản phẩm.');
  };

  const importCsv = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = (await file.text()).replace(/^\uFEFF/, '');
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) { setNotice('Tệp CSV chưa có dữ liệu sản phẩm.'); return; }
    const parseRow = (line) => line.match(/("(?:[^"]|"")*"|[^,]*)(,|$)/g)?.map((part) => part.replace(/,$/, '').replace(/^"|"$/g, '').replaceAll('""', '"')) || [];
    const headers = parseRow(lines[0]).map((header) => header.trim().toLocaleLowerCase('vi'));
    const nameIndex = headers.findIndex((header) => ['tên sản phẩm', 'name'].includes(header));
    const skuIndex = headers.findIndex((header) => header === 'sku');
    const categoryIndex = headers.findIndex((header) => ['danh mục', 'category'].includes(header));
    const priceIndex = headers.findIndex((header) => ['giá bán', 'price'].includes(header));
    const stockIndex = headers.findIndex((header) => ['tồn kho', 'stock'].includes(header));
    if ([nameIndex, skuIndex, priceIndex, stockIndex].some((index) => index < 0)) { setNotice('Tệp CSV cần có cột tên sản phẩm, SKU, giá bán và tồn kho.'); return; }
    const imported = lines.slice(1).map(parseRow).filter((row) => row[nameIndex]?.trim() && row[skuIndex]?.trim()).map((row, index) => ({
      id: Date.now() + index, name: row[nameIndex].trim(), variant: '', sku: row[skuIndex].trim(), category: row[categoryIndex] || 'Bàn phím cơ',
      price: Number(row[priceIndex].replace(/[^\d]/g, '')), stock: Number(row[stockIndex].replace(/[^\d]/g, '')), image: thread75, published: false,
    })).filter((product) => Number.isFinite(product.price) && Number.isFinite(product.stock));
    if (!imported.length) { setNotice('Không tìm thấy dòng sản phẩm hợp lệ trong tệp CSV.'); return; }
    setProducts((current) => [...imported, ...current]);
    setNotice(`Đã nhập ${imported.length} sản phẩm.`);
    event.target.value = '';
  };

  return <div className="pm-dashboard" data-node-id="52:489"><Sidebar /><main className="pm-main" data-node-id="52:548">
    <header className="pm-topbar" data-node-id="52:549"><span>8ThreadTech</span><span className="pm-slash">/</span><strong>Sản phẩm</strong></header>
    <div className="pm-content" data-node-id="52:553">
      <div className="pm-title-row" data-node-id="52:555"><h1 data-node-id="52:557">Quản lý sản phẩm</h1><div className="pm-actions">
        <input ref={fileInput} className="pm-file-input" type="file" accept=".csv,text/csv" onChange={importCsv} aria-label="Nhập tệp CSV" />
        <button className="pm-button secondary" onClick={() => fileInput.current?.click()}><IconFileImport size={16} />Nhập file</button>
        <button className="pm-button secondary" onClick={exportCsv}><IconDownload size={16} />Xuất file</button>
        <button className="pm-button primary" onClick={() => { setDialogProduct(null); setDialogOpen(true); }}><IconPlus size={17} />Thêm sản phẩm</button>
      </div></div>
      <section className="pm-stats" aria-label="Tổng quan sản phẩm" data-node-id="52:569">{stats.map(({ label, value, note, Icon, alert }, index) => <article className="pm-stat" key={label} data-node-id={['52:570', '52:576', '52:582', '52:588'][index]}><div className="pm-stat-label"><span>{label}</span><Icon size={17} stroke={1.5} /></div><strong>{value}</strong><small className={alert ? 'alert' : ''}>{note}</small></article>)}</section>
      <section className="pm-table-panel" aria-label="Danh sách sản phẩm" data-node-id="52:594">
        <div className="pm-tabs" data-node-id="52:595" role="tablist" aria-label="Lọc theo tồn kho">{[['all', 'Tất cả'], ['available', 'Còn hàng'], ['low', 'Sắp hết hàng'], ['out', 'Hết hàng']].map(([key, label]) => <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? 'selected' : ''} onClick={() => setTab(key)}>{label}<span>{counts[key]}</span></button>)}<span className="pm-column-label"><IconAdjustments size={14} /> Tùy chỉnh cột</span></div>
        <div className="pm-filters" data-node-id="52:616"><label className="pm-search" data-node-id="52:617"><IconSearch size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên sản phẩm hoặc SKU..." aria-label="Tìm sản phẩm" /></label>
          <label><span className="sr-only">Danh mục</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">Tất cả danh mục</option><option>Bàn phím cơ</option><option>Bàn phím gaming</option><option>Bàn phím low-profile</option></select><IconChevronDown size={14} /></label>
          <label><span className="sr-only">Trạng thái xuất bản</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Tất cả trạng thái</option><option value="published">Đang hiển thị</option><option value="draft">Bản nháp</option></select><IconChevronDown size={14} /></label>
          <label><span className="sr-only">Sắp xếp</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Sắp xếp: Mới nhất</option><option value="price-asc">Giá: Thấp đến cao</option><option value="price-desc">Giá: Cao đến thấp</option></select><IconChevronDown size={14} /></label>
        </div>
        <div className="pm-table-scroll"><table className="pm-table"><thead data-node-id="52:629"><tr><th className="pm-check-cell"><input type="checkbox" aria-label="Chọn tất cả sản phẩm" /></th><th>Sản phẩm</th><th>SKU</th><th>Danh mục</th><th className="align-right">Giá bán</th><th className="align-right">Tồn kho</th><th>Trạng thái</th><th className="align-right">Thao tác</th></tr></thead><tbody>
          {visibleProducts.map((product, index) => { const stock = stockState(product.stock); return <tr key={product.id} data-node-id={['52:638', '52:659', '52:680', '52:701', '52:722', '52:743', '52:764', '52:785', '52:806'][index]}><td className="pm-check-cell"><input type="checkbox" aria-label={`Chọn ${product.name}`} /></td><td><div className="pm-product-cell"><span className="pm-product-image"><img src={product.image} alt="" /></span><span className="pm-product-copy"><strong>{product.name}</strong><small>{product.variant}</small></span></div></td><td className="pm-muted">{product.sku}</td><td className="pm-category">{product.category}</td><td className="align-right pm-price">{formatPrice(product.price)}</td><td className={`align-right pm-stock ${stock}`}><strong>{product.stock}</strong><small>{stock === 'out' ? 'Hết hàng' : stock === 'low' ? 'Sắp hết' : 'Có sẵn'}</small></td><td><span className={`pm-published ${product.published ? '' : 'draft'}`}><i />{product.published ? 'Đang hiển thị' : 'Bản nháp'}</span></td><td><div className="pm-row-actions"><button className="pm-icon-button" aria-label={`Chỉnh sửa ${product.name}`} onClick={() => { setDialogProduct(product); setDialogOpen(true); }}><IconAdjustments size={15} /></button><button className="pm-icon-button" aria-label={`Đổi trạng thái ${product.name}`} onClick={() => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, published: !item.published } : item))}><IconDots size={17} /></button></div></td></tr>; })}
          {!visibleProducts.length && <tr><td colSpan="8" className="pm-empty">Không tìm thấy sản phẩm phù hợp với bộ lọc.</td></tr>}
        </tbody></table></div>
        <div className="pm-pagination" data-node-id="52:827"><span>Hiển thị {visibleProducts.length ? `1–${visibleProducts.length}` : '0'} trong {visibleProducts.length} sản phẩm</span><div><small>9 / trang</small><button aria-label="Trang trước" disabled><IconChevronLeft size={15} /></button><button className="current" aria-current="page">1</button><button disabled>2</button><button disabled>3</button><button className="pm-next" disabled>Trang sau <IconChevronRight size={14} /></button></div></div>
      </section>
      <p className="pm-updated">Cập nhật lần cuối lúc 23:59, 25/10/2026 • Múi giờ Việt Nam (GMT+7)</p>
    </div>
  </main>
  {dialogOpen && <ProductDialog product={dialogProduct} onClose={() => setDialogOpen(false)} onSave={saveProduct} />}
  {notice && <div className="pm-toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Đóng thông báo"><IconX size={15} /></button></div>}
  </div>;
}
