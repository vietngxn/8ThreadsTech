import { useEffect, useMemo, useState } from 'react';
import {
  IconArrowsLeftRight, IconCalendar, IconChevronDown,
  IconFileDownload,
  IconMinus, IconPackage, IconReceipt, IconShoppingBag,
  IconTrendingUp, IconWallet,
} from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import { productService } from '../../services/productService.js';
import keyboard75 from '../../assets/list-thread-75.png';
import keyboard80 from '../../assets/list-thread-80-pro.png';
import keyboard65 from '../../assets/list-thread-65.png';
import keyboard98 from '../../assets/list-thread-98.png';
import keyboard60 from '../../assets/list-thread-60-he.png';
import './AdminStatistics.css';

const defaultProducts = [
  { image: keyboard75, name: 'THREAD 75', variant: 'Bạc ánh trăng • Linear Red Switch', category: 'Bàn phím', units: 12, price: '2.490.000 ₫', revenue: '29.880.000 ₫', revenueValue: 29880000, share: 23.3, growth: '+20,0%' },
  { image: keyboard80, name: 'THREAD 80 PRO', variant: 'Xám titan • Linear Silver Switch', category: 'Bàn phím', units: 6, price: '3.290.000 ₫', revenue: '19.740.000 ₫', revenueValue: 19740000, share: 15.4, growth: '+20,0%' },
  { image: keyboard65, name: 'THREAD 65', variant: 'Đen nguyên bản • Linear Red Switch', category: 'Bàn phím', units: 10, price: '1.890.000 ₫', revenue: '18.900.000 ₫', revenueValue: 18900000, share: 14.7, growth: '+11,1%' },
  { image: keyboard98, name: 'THREAD 98', variant: 'Trắng sương • Tactile Brown Switch', category: 'Bàn phím', units: 8, price: '2.190.000 ₫', revenue: '17.520.000 ₫', revenueValue: 17520000, share: 13.6, growth: '0,0%' },
  { image: keyboard60, name: 'THREAD 60 HE', variant: 'Đỏ dung nham • Switch từ tính', category: 'Bàn phím', units: 4, price: '2.790.000 ₫', revenue: '11.160.000 ₫', revenueValue: 11160000, share: 8.7, growth: '+33,3%' },
];

const revenueByDay = [14.4, 18.8, 16.2, 22.6, 17.6, 24.8, 14.0];
const ordersByDay = [24, 32, 27, 36, 29, 42, 24];
const dates = ['19/10', '20/10', '21/10', '22/10', '23/10', '24/10', '25/10'];
const points = revenueByDay.map((value, index) => `${44 + index * 86},${180 - value * 6}`).join(' ');

function RevenueChart() {
  return <section className="stats-panel stats-revenue" data-node-id="64:2154">
    <div className="stats-panel-heading"><div><h2>Doanh thu &amp; đơn hàng</h2><p>19 – 25/10/2026 • Triệu đồng / Đơn hàng</p></div><button className="stats-select-button" type="button">Theo ngày <IconChevronDown size={13} /></button></div>
    <div className="stats-legend"><span><i className="legend-revenue" />Doanh thu thuần</span><span><i className="legend-orders" />Đơn hoàn thành</span></div>
    <div className="stats-chart-area" role="img" aria-label="Biểu đồ doanh thu và đơn hàng từ ngày 19 đến 25 tháng 10">
      <div className="stats-left-axis"><span>30</span><span>20</span><span>10</span><span>0</span></div>
      <div className="stats-plot">
        <div className="stats-gridlines"><i /><i /><i /><i /></div>
        <div className="stats-bars">{ordersByDay.map((count, index) => <div className="stats-bar-slot" key={dates[index]}><span className="stats-bar" style={{ height: `${count / 60 * 100}%` }} /><small>{count}</small></div>)}</div>
        <svg viewBox="0 0 604 180" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="stats-revenue-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f02b24" stopOpacity=".18" /><stop offset="1" stopColor="#f02b24" stopOpacity="0" /></linearGradient></defs><polygon points={`44,${180 - revenueByDay[0] * 6} ${points.slice(points.indexOf(' ') + 1)} 560,180 44,180`} fill="url(#stats-revenue-fill)" /><polyline points={points} fill="none" stroke="#f02b24" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />{revenueByDay.map((value, index) => <g key={dates[index]}><circle cx={44 + index * 86} cy={180 - value * 6} r="3.5" fill="#f02b24" stroke="#0f0f0f" strokeWidth="2" /><text x={44 + index * 86} y={180 - value * 6 - 12} fill="#f02b24" fontSize="9" textAnchor="middle">{value.toFixed(1).replace('.', ',')}</text></g>)}</svg>
        <div className="stats-chart-dates">{dates.map(date => <span key={date}>{date}</span>)}</div>
      </div>
      <div className="stats-right-axis"><span>60</span><span>40</span><span>20</span><span>0</span></div>
    </div>
    <p className="stats-chart-note">Cao nhất ngày 24/10: 24,8 triệu ₫ • 42 đơn hoàn thành</p>
  </section>;
}

function CategoryChart() {
  const categories = [
    ['Bàn phím', '102.720.000 ₫', '80%', '#f02b24'],
    ['Keycap', '12.840.000 ₫', '10%', '#f47e74'],
    ['Switch', '7.704.000 ₫', '6%', '#96504b'],
    ['Phụ kiện', '5.136.000 ₫', '4%', '#51413f'],
  ];
  return <section className="stats-panel stats-category" data-node-id="64:2230">
    <div className="stats-panel-heading"><div><h2>Doanh thu theo danh mục</h2><p>Tỷ trọng trên tổng doanh thu thuần</p></div></div>
    <div className="stats-donut-wrap"><div className="stats-donut"><div><strong>128,4</strong><span>triệu đồng</span></div></div></div>
    <ul className="stats-category-list">{categories.map(([name, revenue, share, color]) => <li key={name}><span className="stats-category-name"><i style={{ background: color }} />{name}</span><strong>{revenue}</strong><b>{share}</b></li>)}</ul>
  </section>;
}

export default function AdminStatistics() {
  const [period, setPeriod] = useState('7 ngày');
  const [category, setCategory] = useState('Tất cả danh mục');
  const [productList, setProductList] = useState(defaultProducts);

  useEffect(() => {
    let alive = true;
    productService.getProducts({ pageSize: 5, sortBy: 'viewCount', sortDirection: 'desc' })
      .then((res) => {
        if (!alive) return;
        if (res?.products && res.products.length > 0) {
          const totalUnits = 40;
          const mapped = res.products.slice(0, 5).map((p, idx) => {
            const units = [12, 10, 8, 6, 4][idx] || 5;
            const priceVal = typeof p.price === 'number' ? p.price : 2000000;
            const revenueVal = priceVal * units;
            const share = Math.round((units / totalUnits) * 1000) / 10;
            return {
              image: p.image || keyboard75,
              name: p.name,
              variant: p.variant || (p.colors?.[0]?.switchDesc || 'Linear Switch'),
              category: p.categoryName || 'Bàn phím',
              units,
              price: `${priceVal.toLocaleString('vi-VN')} ₫`,
              revenue: `${revenueVal.toLocaleString('vi-VN')} ₫`,
              revenueValue: revenueVal,
              share,
              growth: `+${(15 + idx * 4)}%`,
            };
          });
          setProductList(mapped);
        }
      })
      .catch((err) => console.warn('Lỗi tải sản phẩm thống kê:', err));

    return () => {
      alive = false;
    };
  }, []);

  const filteredProducts = useMemo(
    () => (category === 'Tất cả danh mục' ? productList : productList.filter((product) => product.category === category)),
    [category, productList]
  );
  const dateRange = period === '7 ngày' ? '19/10 – 25/10/2026' : period === '30 ngày' ? '26/09 – 25/10/2026' : '01/10 – 25/10/2026';
  const totalRevenue = filteredProducts.reduce((sum, product) => sum + product.revenueValue, 0);
  const totalShare = filteredProducts.reduce((sum, product) => sum + product.share, 0);
  const formatCurrency = value => `${new Intl.NumberFormat('vi-VN').format(value)} ₫`;

  const exportReport = () => {
    const rows = [['Sản phẩm', 'Phiên bản', 'Đã bán', 'Giá bán trung bình', 'Doanh thu thuần', 'Tỷ trọng', 'So với kỳ trước'], ...filteredProducts.map(({ name, variant, units, price, revenue, share, growth }) => [name, variant, units, price, revenue, `${share}%`, growth])];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'bao-cao-thong-ke.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return <div className="stats-dashboard" data-node-id="64:2027">
    <AdminSidebar />
    <main className="stats-main" data-node-id="64:2086">
      <header className="stats-topbar" data-node-id="64:2087"><span>8ThreadTech</span><span className="stats-slash">/</span><strong>Thống kê</strong></header>
      <div className="stats-content" data-node-id="64:2091">
        <section className="stats-report-overview" data-node-id="64:2092">
          <div className="stats-title-row"><div><h1 data-node-id="64:2095">Thống kê kinh doanh</h1><p>Phân tích doanh thu, xu hướng đơn hàng và hiệu quả sản phẩm.</p></div><button className="stats-export" onClick={exportReport}><IconFileDownload size={16} />Xuất báo cáo</button></div>
          <div className="stats-period-filter" data-node-id="64:2100">
            <div className="stats-period-controls" role="group" aria-label="Chọn kỳ báo cáo">{['7 ngày', '30 ngày', 'Tháng này'].map(value => <button key={value} className={period === value ? 'selected' : ''} onClick={() => setPeriod(value)} aria-pressed={period === value}>{value}</button>)}</div>
            <div className="stats-date-range"><IconCalendar size={15} />{dateRange}<IconChevronDown size={12} /></div>
            <span className="stats-period-compare"><IconArrowsLeftRight size={14} />So với {period === '7 ngày' ? '12/10 – 18/10/2026' : 'kỳ trước'}</span>
          </div>
        </section>
        <section className="stats-metrics" aria-label="Chỉ số kinh doanh" data-node-id="64:2116">
          {[
            ['Doanh thu thuần', '128.400.000 ₫', '12,8%', IconWallet],
            ['Đơn hàng hoàn thành', '214', '8,1%', IconShoppingBag],
            ['Sản phẩm bán', '326', '10,1%', IconPackage],
            ['Giá trị đơn trung bình', '600.000 ₫', '4,4%', IconReceipt],
          ].map(([label, value, change, Icon]) => <article className="stats-metric" key={label}><div className="stats-metric-label">{label}<Icon size={17} stroke={1.4} /></div><strong>{value}</strong><div className="stats-comparison"><IconTrendingUp size={13} /><b>{change}</b><span>so với tuần trước</span></div></article>)}
        </section>
        <div className="stats-analytics-grid"><RevenueChart /><CategoryChart /></div>
        <section className="stats-panel stats-products" data-node-id="64:2263">
          <div className="stats-products-heading"><div><h2>Sản phẩm bán chạy</h2><p>Top 5 theo doanh thu thuần • Trong kỳ báo cáo</p></div><label className="stats-category-select"><span className="sr-only">Lọc theo danh mục</span><select value={category} onChange={event => setCategory(event.target.value)}><option>Tất cả danh mục</option><option>Bàn phím</option><option>Keycap</option><option>Switch</option><option>Phụ kiện</option></select><IconChevronDown size={12} /></label></div>
          <div className="stats-table-wrap"><table><thead><tr><th>#</th><th>Sản phẩm</th><th>Đã bán</th><th>Giá bán TB</th><th>Doanh thu thuần ↓</th><th>Tỷ trọng</th><th>So với kỳ trước</th></tr></thead><tbody>{filteredProducts.map((product, index) => <tr key={product.name}><td className={index === 0 ? 'stats-rank-first' : 'stats-rank'}>{String(index + 1).padStart(2, '0')}</td><td><div className="stats-product-cell"><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.variant}</small></span></div></td><td className="stats-align-right">{product.units}</td><td className="stats-align-right stats-muted">{product.price}</td><td className="stats-align-right stats-revenue-cell">{product.revenue}</td><td><div className="stats-share"><span>{product.share.toFixed(1).replace('.', ',')}%</span><i><b style={{ width: `${product.share / 23.3 * 100}%` }} /></i></div></td><td className={`stats-growth${product.growth === '0,0%' ? ' unchanged' : ''}`}>{product.growth === '0,0%' ? <IconMinus size={12} /> : <IconTrendingUp size={12} />}{product.growth}</td></tr>)}</tbody><tfoot><tr><td colSpan="2">Tổng {filteredProducts.length} sản phẩm</td><td className="stats-align-right">{filteredProducts.reduce((sum, product) => sum + product.units, 0)}</td><td className="stats-align-right stats-muted">—</td><td className="stats-align-right stats-revenue-cell">{formatCurrency(totalRevenue)}</td><td className="stats-share-total">{totalShare.toFixed(1).replace('.', ',')}%</td><td className="stats-align-right stats-muted">—</td></tr></tfoot></table></div>
          <div className="stats-table-note">Chỉ tính đơn hoàn thành; doanh thu sau giảm giá, không gồm phí vận chuyển. Không tính đơn hủy hoặc hoàn trả.</div>
        </section>
        <footer className="stats-footer"><span>Cập nhật lần cuối lúc 23:59, 25/10/2026 • Múi giờ Việt Nam (GMT+7)</span><span>Đơn vị tiền tệ: VND</span></footer>
      </div>
    </main>
  </div>;
}
