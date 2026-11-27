import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconChartLine,
  IconChevronRight,
  IconPackage,
  IconSearch,
  IconSettings,
  IconShoppingBag,
  IconTicket,
  IconUsers,
} from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import './AdminHelp.css';

const topics = [
  { title: 'Sản phẩm và danh mục', description: 'Thêm sản phẩm, quản lý danh mục và cập nhật tồn kho.', href: '/admin/products', icon: IconPackage, node: '219:150' },
  { title: 'Đơn hàng và vận chuyển', description: 'Xác nhận đơn, theo dõi giao hàng và xử lý đổi trả.', href: '/admin/orders', icon: IconShoppingBag, node: '219:157' },
  { title: 'Khách hàng', description: 'Tra cứu và cập nhật thông tin khách hàng.', href: '/admin/customers', icon: IconUsers, node: '219:164' },
  { title: 'Khuyến mãi', description: 'Tạo mã giảm giá và quản lý chương trình ưu đãi.', href: '/admin/promotions', icon: IconTicket, node: '219:172' },
  { title: 'Thống kê và báo cáo', description: 'Đọc chỉ số kinh doanh và xuất báo cáo doanh thu.', href: '/admin/statistics', icon: IconChartLine, node: '219:179' },
  { title: 'Cài đặt và nhật kí', description: 'Tùy chỉnh hệ thống và tra cứu lịch sử hoạt động.', href: '/admin/settings', icon: IconSettings, node: '219:186' },
];

const faqs = [
  {
    question: 'Làm thế nào để thêm một sản phẩm mới?',
    answer: 'Vào Sản phẩm → Thêm sản phẩm. Nhập thông tin, giá bán, số lượng và hình ảnh; chọn danh mục rồi lưu sản phẩm để hoàn tất.',
    link: '/admin/products',
    linkLabel: 'Xem hướng dẫn chi tiết',
    node: '219:197',
  },
  {
    question: 'Làm thế nào để cập nhật trạng thái đơn hàng?',
    answer: 'Mở Đơn hàng, chọn đơn cần xử lý rồi cập nhật trạng thái phù hợp. Bạn có thể thêm mã vận đơn trước khi chuyển đơn sang trạng thái đang giao.',
    link: '/admin/orders',
    linkLabel: 'Quản lý đơn hàng',
    node: '219:203',
  },
  {
    question: 'Vì sao mã giảm giá không được áp dụng?',
    answer: 'Kiểm tra thời hạn, trạng thái kích hoạt, số lượt sử dụng và giá trị đơn tối thiểu của mã. Mã cũng cần được áp dụng cho đúng sản phẩm hoặc nhóm khách hàng.',
    link: '/admin/promotions',
    linkLabel: 'Kiểm tra chương trình khuyến mãi',
    node: '219:207',
  },
  {
    question: 'Tôi có thể xuất báo cáo doanh thu ở đâu?',
    answer: 'Vào Thống kê để xem doanh thu theo khoảng thời gian. Chọn khoảng ngày cần xem rồi sử dụng nút xuất báo cáo trên trang.',
    link: '/admin/statistics',
    linkLabel: 'Mở thống kê',
    node: '219:211',
  },
  {
    question: 'Làm sao để xem lịch sử chỉnh sửa dữ liệu?',
    answer: 'Nhật kí lưu lại các hoạt động quản trị gần đây. Mở Nhật kí từ thanh điều hướng để tra cứu theo thời gian và loại hoạt động.',
    link: '/admin/logs',
    linkLabel: 'Tra cứu nhật kí hệ thống',
    node: '219:215',
  },
];

const popularSearches = ['Thêm sản phẩm', 'Xử lý đơn hàng', 'Tạo mã giảm giá'];

export default function AdminHelp() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState('219:197');
  const query = search.trim().toLocaleLowerCase('vi');
  const visibleFaqs = faqs.filter(({ question, answer }) =>
    `${question} ${answer}`.toLocaleLowerCase('vi').includes(query)
  );

  return (
    <div className="help-dashboard" data-node-id="219:2">
      <AdminSidebar />
      <main className="help-main" data-node-id="219:61">
        <header className="help-topbar" data-node-id="219:62">
          <span>8ThreadTech</span><span aria-hidden="true">/</span><strong>Trung tâm trợ giúp</strong>
        </header>
        <div className="help-content" data-node-id="219:66">
          <div className="help-heading" data-node-id="219:128">
            <h1>Trung tâm trợ giúp</h1>
            <p>Tìm hướng dẫn và giải đáp để quản lý cửa hàng dễ dàng hơn.</p>
          </div>

          <section className="help-search-panel" aria-labelledby="help-search-title" data-node-id="219:129">
            <h2 id="help-search-title">Bạn cần hỗ trợ điều gì?</h2>
            <form className="help-search-form" role="search" onSubmit={event => event.preventDefault()}>
              <label className="help-search-input-wrap">
                <span className="sr-only">Tìm câu hỏi hoặc từ khóa</span>
                <IconSearch size={17} aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Nhập câu hỏi hoặc từ khóa, ví dụ: cập nhật trạng thái đơn hàng..."
                />
              </label>
              <button type="submit">Tìm kiếm</button>
            </form>
            <div className="help-popular" data-node-id="219:141">
              <span>Tìm kiếm phổ biến:</span>
              {popularSearches.map(term => (
                <button key={term} type="button" onClick={() => setSearch(term)}>{term}</button>
              ))}
            </div>
          </section>

          <section className="help-topics" aria-labelledby="help-topics-title" data-node-id="219:130">
            <div className="help-section-heading" data-node-id="219:146">
              <h2 id="help-topics-title">Khám phá theo chủ đề</h2>
              <span>Hướng dẫn dành cho người quản trị</span>
            </div>
            <div className="help-topic-grid">
              {topics.map(({ title, description, href, icon: Icon, node }) => (
                <Link className="help-topic-card" to={href} key={title} data-node-id={node}>
                  <span className="help-topic-title"><Icon size={17} stroke={1.5} aria-hidden="true" /><strong>{title}</strong></span>
                  <span className="help-topic-description">{description}</span>
                  <span className="help-topic-link">Xem hướng dẫn <span aria-hidden="true">→</span></span>
                </Link>
              ))}
            </div>
          </section>

          <div className="help-lower-grid" data-node-id="219:131">
            <section className="help-faq-panel" aria-labelledby="help-faq-title">
              <header className="help-faq-heading" data-node-id="219:194">
                <h2 id="help-faq-title">Câu hỏi thường gặp</h2>
                <p>Giải đáp nhanh cho các thao tác hằng ngày.</p>
              </header>
              <div className="help-faq-list">
                {visibleFaqs.map(({ question, answer, link, linkLabel, node }) => {
                  const isOpen = openFaq === node;
                  return (
                    <article className={`help-faq-item${isOpen ? ' is-open' : ''}`} key={node} data-node-id={node}>
                      <h3>
                        <button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? '' : node)}>
                          <span>{question}</span><span className="help-faq-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                        </button>
                      </h3>
                      {isOpen && <div className="help-faq-answer">
                        <p>{answer}</p>
                        <Link to={link}>{linkLabel} <span aria-hidden="true">→</span></Link>
                      </div>}
                    </article>
                  );
                })}
                {visibleFaqs.length === 0 && <p className="help-no-results" role="status">Không tìm thấy câu hỏi phù hợp. Hãy thử từ khóa khác.</p>}
              </div>
            </section>

            <aside className="help-useful-panel" aria-labelledby="help-useful-title" data-node-id="219:226">
              <h2 id="help-useful-title">Liên kết hữu ích</h2>
              <Link to="/admin" data-node-id="219:228">Hướng dẫn bắt đầu sử dụng <IconChevronRight size={15} aria-hidden="true" /></Link>
              <Link to="/admin/logs" data-node-id="219:231">Tra cứu nhật kí hệ thống <IconChevronRight size={15} aria-hidden="true" /></Link>
              <Link to="/admin/settings" data-node-id="219:234">Cài đặt thông báo và phiên đăng nhập <IconChevronRight size={15} aria-hidden="true" /></Link>
            </aside>
          </div>

          <footer className="help-footer" data-node-id="219:132">
            <span>8ThreadTech · Trung tâm trợ giúp</span>
            <span>Hướng dẫn sử dụng trang quản trị</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
