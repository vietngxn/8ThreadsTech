import { useMemo, useState } from 'react';
import {
  IconAdjustments, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconClockHour3, IconColumns3, IconDots, IconDownload, IconEye,
  IconReceipt, IconSearch, IconShoppingBag, IconTruck, IconUser, IconWallet, IconX,
} from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import './AdminOrderManagement.css';

const orders = [
  {
    id: '#8TT-1024',
    numericId: 1,
    orderCode: 'ORD-F4AA92C502E6487D9E11',
    userId: 2,
    sourceType: 'CART',
    status: 'PENDING',
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    shippingMethodId: 1,
    shippingMethodCode: 'STANDARD',
    shippingMethodName: 'Giao hàng tiêu chuẩn',
    customerName: 'Nguyen Van A',
    customerEmail: 'a@example.com',
    customerPhone: '0901234567',
    province: 'Ho Chi Minh',
    district: 'Quan 1',
    ward: 'Ben Nghe',
    addressLine: '123 Nguyen Hue',
    subtotalAmount: 8190000,
    discountAmount: 0,
    shippingFee: 30000,
    totalAmount: 8220000,
    couponId: null,
    couponCode: null,
    customerNote: 'Giao giờ hành chính',
    cancelReason: null,
    paymentDeadline: null,
    product: 'THREAD 75',
    quantity: 2,
    customer: 'Nguyen Van A',
    phone: '0901 234 567',
    amount: 8220000,
    payment: 'Chưa thu',
    method: 'Thu hộ khi nhận (COD)',
    delivery: 'Chờ xác nhận',
    date: '25/10/2026',
    time: '22:48',
  },
  {
    id: '#8TT-1023',
    numericId: 2,
    orderCode: 'ORD-B2CC71A190D4183E2F40',
    userId: 5,
    sourceType: 'CART',
    status: 'PENDING',
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    shippingMethodId: 1,
    shippingMethodCode: 'STANDARD',
    shippingMethodName: 'Giao hàng tiêu chuẩn',
    customerName: 'Trần Minh Thư',
    customerEmail: 'minhthu.tran@gmail.com',
    customerPhone: '0938456789',
    province: 'Ho Chi Minh',
    district: 'Binh Thanh',
    ward: 'Phuong 25',
    addressLine: '45 Điện Biên Phủ',
    subtotalAmount: 1860000,
    discountAmount: 0,
    shippingFee: 30000,
    totalAmount: 1890000,
    couponId: null,
    couponCode: null,
    customerNote: 'Gọi trước khi giao',
    cancelReason: null,
    paymentDeadline: null,
    product: 'THREAD 65',
    quantity: 1,
    customer: 'Trần Minh Thư',
    phone: '0938 456 789',
    amount: 1890000,
    payment: 'Chưa thu',
    method: 'Thu hộ khi nhận',
    delivery: 'Chờ xác nhận',
    date: '25/10/2026',
    time: '21:35',
  },
  {
    id: '#8TT-1022',
    numericId: 3,
    orderCode: 'ORD-A91E44D301F7889A11C2',
    userId: 8,
    sourceType: 'CART',
    status: 'PROCESSING',
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'PAID',
    shippingMethodId: 2,
    shippingMethodCode: 'EXPRESS',
    shippingMethodName: 'Giao hàng hỏa tốc',
    customerName: 'Lê Đức Anh',
    customerEmail: 'ducanh.le@gmail.com',
    customerPhone: '0987123456',
    province: 'Ha Noi',
    district: 'Cau Giay',
    ward: 'Dich Vong',
    addressLine: '88 Cầu Giấy',
    subtotalAmount: 3240000,
    discountAmount: 0,
    shippingFee: 50000,
    totalAmount: 3290000,
    couponId: null,
    couponCode: null,
    customerNote: 'Giao trong ngày',
    cancelReason: null,
    paymentDeadline: null,
    product: 'THREAD 80 PRO',
    quantity: 1,
    customer: 'Lê Đức Anh',
    phone: '0987 123 456',
    amount: 3290000,
    payment: 'Đã thanh toán',
    method: 'Chuyển khoản',
    delivery: 'Đang xử lý',
    date: '25/10/2026',
    time: '20:12',
  },
  {
    id: '#8TT-1021',
    numericId: 4,
    orderCode: 'ORD-C55D21E908B1278C33A1',
    userId: 11,
    sourceType: 'DIRECT',
    status: 'SHIPPING',
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    shippingMethodId: 1,
    shippingMethodCode: 'STANDARD',
    shippingMethodName: 'Giao hàng tiêu chuẩn',
    customerName: 'Phạm Ngọc Linh',
    customerEmail: 'ngoclinh.pham@gmail.com',
    customerPhone: '0912678345',
    province: 'Da Nang',
    district: 'Hai Chau',
    ward: 'Thach Thang',
    addressLine: '12 Bạch Đằng',
    subtotalAmount: 760000,
    discountAmount: 0,
    shippingFee: 30000,
    totalAmount: 790000,
    couponId: null,
    couponCode: null,
    customerNote: 'Giao giờ hành chính',
    cancelReason: null,
    paymentDeadline: null,
    product: 'Bộ keycap PBT',
    quantity: 2,
    customer: 'Phạm Ngọc Linh',
    phone: '0912 678 345',
    amount: 790000,
    payment: 'Chưa thu',
    method: 'Thu hộ khi nhận',
    delivery: 'Đang giao',
    date: '25/10/2026',
    time: '18:46',
  },
  {
    id: '#8TT-1020',
    numericId: 5,
    orderCode: 'ORD-E88A12F776C5512D99B0',
    userId: 14,
    sourceType: 'CART',
    status: 'SHIPPING',
    paymentMethod: 'MOMO',
    paymentStatus: 'PAID',
    shippingMethodId: 1,
    shippingMethodCode: 'STANDARD',
    shippingMethodName: 'Giao hàng tiêu chuẩn',
    customerName: 'Võ Thanh Tùng',
    customerEmail: 'thanhtung.vo@gmail.com',
    customerPhone: '0976543210',
    province: 'Ho Chi Minh',
    district: 'Quan 7',
    ward: 'Tan Phong',
    addressLine: '70 Nguyễn Thị Thập',
    subtotalAmount: 2160000,
    discountAmount: 0,
    shippingFee: 30000,
    totalAmount: 2190000,
    couponId: null,
    couponCode: null,
    customerNote: 'Để tại lễ tân nếu vắng nhà',
    cancelReason: null,
    paymentDeadline: null,
    product: 'THREAD 98',
    quantity: 1,
    customer: 'Võ Thanh Tùng',
    phone: '0976 543 210',
    amount: 2190000,
    payment: 'Đã thanh toán',
    method: 'Ví MoMo',
    delivery: 'Đang giao',
    date: '25/10/2026',
    time: '16:08',
  },
  {
    id: '#8TT-1019',
    numericId: 6,
    orderCode: 'ORD-F11B99E443A2190C88D4',
    userId: 19,
    sourceType: 'CART',
    status: 'DELIVERED',
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'PAID',
    shippingMethodId: 1,
    shippingMethodCode: 'STANDARD',
    shippingMethodName: 'Giao hàng tiêu chuẩn',
    customerName: 'Đặng Gia Huy',
    customerEmail: 'giahuy.dang@gmail.com',
    customerPhone: '0903876543',
    province: 'Can Tho',
    district: 'Ninh Kieu',
    ward: 'An Khanh',
    addressLine: '30 Nguyễn Văn Cừ',
    subtotalAmount: 3110000,
    discountAmount: 0,
    shippingFee: 30000,
    totalAmount: 3140000,
    couponId: null,
    couponCode: null,
    customerNote: 'Giao giờ hành chính',
    cancelReason: null,
    paymentDeadline: null,
    product: 'THREAD 60 HE',
    quantity: 2,
    customer: 'Đặng Gia Huy',
    phone: '0903 876 543',
    amount: 3140000,
    payment: 'Đã thanh toán',
    method: 'Chuyển khoản',
    delivery: 'Đã giao',
    date: '24/10/2026',
    time: '15:24',
  },
  {
    id: '#8TT-1018',
    numericId: 7,
    orderCode: 'ORD-D33C88A221F5543B77E9',
    userId: 22,
    sourceType: 'CART',
    status: 'DELIVERED',
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    shippingMethodId: 1,
    shippingMethodCode: 'STANDARD',
    shippingMethodName: 'Giao hàng tiêu chuẩn',
    customerName: 'Bùi Thảo Vy',
    customerEmail: 'thaovy.bui@gmail.com',
    customerPhone: '0945321678',
    province: 'Ho Chi Minh',
    district: 'Quan 3',
    ward: 'Vo Thi Sau',
    addressLine: '15 Võ Văn Tần',
    subtotalAmount: 320000,
    discountAmount: 0,
    shippingFee: 30000,
    totalAmount: 350000,
    couponId: null,
    couponCode: null,
    customerNote: null,
    cancelReason: null,
    paymentDeadline: null,
    product: 'Cáp cuộn USB-C',
    quantity: 1,
    customer: 'Bùi Thảo Vy',
    phone: '0945 321 678',
    amount: 350000,
    payment: 'Đã thanh toán',
    method: 'Thu hộ khi nhận',
    delivery: 'Đã giao',
    date: '24/10/2026',
    time: '11:42',
  },
  {
    id: '#8TT-1017',
    numericId: 8,
    orderCode: 'ORD-A77E22D119C8834F55B6',
    userId: 25,
    sourceType: 'CART',
    status: 'CANCELLED',
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'REFUNDED',
    shippingMethodId: 1,
    shippingMethodCode: 'STANDARD',
    shippingMethodName: 'Giao hàng tiêu chuẩn',
    customerName: 'Đỗ Quang Minh',
    customerEmail: 'quangminh.do@gmail.com',
    customerPhone: '0968234901',
    province: 'Hai Phong',
    district: 'Hong Bang',
    ward: 'Hoang Van Thu',
    addressLine: '62 Đinh Tiên Hoàng',
    subtotalAmount: 1960000,
    discountAmount: 0,
    shippingFee: 30000,
    totalAmount: 1990000,
    couponId: null,
    couponCode: null,
    customerNote: 'Muốn đổi sang màu khác',
    cancelReason: 'Khách yêu cầu hủy trước khi gửi hàng',
    paymentDeadline: null,
    product: 'THREAD 75 AIR',
    quantity: 1,
    customer: 'Đỗ Quang Minh',
    phone: '0968 234 901',
    amount: 1990000,
    payment: 'Đã hoàn tiền',
    method: 'Chuyển khoản',
    delivery: 'Đã hủy',
    date: '24/10/2026',
    time: '10:17',
  },
  {
    id: '#8TT-1016',
    numericId: 9,
    orderCode: 'ORD-B44A77F552E1190D22C3',
    userId: 30,
    sourceType: 'CART',
    status: 'DELIVERED',
    paymentMethod: 'MOMO',
    paymentStatus: 'PAID',
    shippingMethodId: 1,
    shippingMethodCode: 'STANDARD',
    shippingMethodName: 'Giao hàng tiêu chuẩn',
    customerName: 'Ngô Hải Yến',
    customerEmail: 'haiyen.ngo@gmail.com',
    customerPhone: '0923567890',
    province: 'Ho Chi Minh',
    district: 'Phu Nhuan',
    ward: 'Phuong 7',
    addressLine: '98 Phan Xích Long',
    subtotalAmount: 1610000,
    discountAmount: 0,
    shippingFee: 30000,
    totalAmount: 1640000,
    couponId: null,
    couponCode: null,
    customerNote: 'Giao sau 18h tối',
    cancelReason: null,
    paymentDeadline: null,
    product: 'THREAD 65 LITE',
    quantity: 2,
    customer: 'Ngô Hải Yến',
    phone: '0923 567 890',
    amount: 1640000,
    payment: 'Đã thanh toán',
    method: 'Ví MoMo',
    delivery: 'Đã giao',
    date: '24/10/2026',
    time: '09:05',
  },
];

const tabs = [
  ['all', 'Tất cả', 124], ['Chờ xác nhận', 'Chờ xác nhận', 12], ['Đang xử lý', 'Đang xử lý', 18],
  ['Đang giao', 'Đang giao', 26], ['Đã giao', 'Đã giao', 64], ['Đã hủy', 'Đã hủy', 4],
];
const formatPrice = (price) => `${(price || 0).toLocaleString('vi-VN')} ₫`;

function StatusBadge({ value, type }) {
  const norm = String(value || '').toUpperCase();
  const isSuccess = norm === 'ĐÃ THANH TOÁN' || norm === 'ĐÃ GIAO' || norm === 'PAID' || norm === 'DELIVERED';
  const isInfo = norm === 'ĐANG XỬ LÝ' || norm === 'ĐANG GIAO' || norm === 'PROCESSING' || norm === 'SHIPPING';
  const isDanger = norm === 'ĐÃ HỦY' || norm === 'ĐÃ HOÀN TIỀN' || norm === 'CANCELLED' || norm === 'REFUNDED';
  const statusClass = isSuccess ? 'success' : isInfo ? 'info' : isDanger ? 'danger' : 'pending';
  return <span className={`om-badge ${statusClass}`} data-type={type}><i />{value}</span>;
}

function OrderDialog({ order, onClose }) {
  const fullAddress = [order.addressLine, order.ward, order.district, order.province].filter(Boolean).join(', ') || '—';

  return (
    <div className="om-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="om-dialog" role="dialog" aria-modal="true" aria-labelledby="om-dialog-title">

        {/* Header */}
        <div className="om-dialog-heading">
          <div className="om-dialog-id">
            <span>Mã đơn hàng</span>
            <h2 id="om-dialog-title">{order.id}</h2>
          </div>
          <div className="om-dialog-head-right">
            <div className="om-dialog-statuses">
              <StatusBadge value={order.delivery} />
              <StatusBadge value={order.payment} />
            </div>
            <button className="om-icon-button" onClick={onClose} aria-label="Đóng"><IconX size={18} /></button>
          </div>
        </div>

        <div className="om-dialog-meta">
          <span>{order.date} · {order.time}</span>
          <span className="om-dot" />
          <span>{order.shippingMethodName || 'Giao hàng tiêu chuẩn'}</span>
          <span className="om-dot" />
          <span>{order.method || 'Thu hộ khi nhận'}</span>
          {order.sourceType && <><span className="om-dot" /><span>Nguồn: {order.sourceType}</span></>}
          {order.orderCode && <><span className="om-dot" /><span className="om-meta-code">{order.orderCode}</span></>}
        </div>

        <div className="om-dialog-body">

          {/* Sản phẩm */}
          <div className="om-dialog-section">
            <p className="om-section-label">Sản phẩm</p>
            <div className="om-product-row">
              <div>
                <strong className="om-product-name">{order.product || 'Sản phẩm'}</strong>
                <span className="om-product-qty">x{order.quantity}</span>
              </div>
              <span className="om-product-price">{formatPrice(order.subtotalAmount || order.amount)}</span>
            </div>
          </div>

          {/* Khách hàng */}
          <div className="om-dialog-section">
            <p className="om-section-label">Khách hàng</p>
            <div className="om-info-rows">
              <div className="om-info-row">
                <span>Họ tên</span>
                <strong>{order.customerName || order.customer}</strong>
              </div>
              <div className="om-info-row">
                <span>Số điện thoại</span>
                <strong>{order.customerPhone || order.phone}</strong>
              </div>
              {order.customerEmail && (
                <div className="om-info-row">
                  <span>Email</span>
                  <strong>{order.customerEmail}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          <div className="om-dialog-section">
            <p className="om-section-label">Địa chỉ giao hàng</p>
            <div className="om-info-rows">
              <div className="om-info-row">
                <span>Địa chỉ</span>
                <strong>{order.addressLine || '—'}</strong>
              </div>
              <div className="om-info-row">
                <span>Phường / Xã</span>
                <strong>{order.ward || '—'}</strong>
              </div>
              <div className="om-info-row">
                <span>Quận / Huyện</span>
                <strong>{order.district || '—'}</strong>
              </div>
              <div className="om-info-row">
                <span>Tỉnh / Thành phố</span>
                <strong>{order.province || '—'}</strong>
              </div>
              {order.customerNote && (
                <div className="om-info-row">
                  <span>Ghi chú khách</span>
                  <strong className="om-note-text">"{order.customerNote}"</strong>
                </div>
              )}
            </div>
          </div>

          {/* Vận chuyển */}
          <div className="om-dialog-section">
            <p className="om-section-label">Vận chuyển</p>
            <div className="om-info-rows">
              <div className="om-info-row">
                <span>Phương thức</span>
                <strong>{order.shippingMethodName || 'Giao hàng tiêu chuẩn'}</strong>
              </div>
              {order.shippingMethodCode && (
                <div className="om-info-row">
                  <span>Mã vận chuyển</span>
                  <strong>{order.shippingMethodCode}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Thanh toán */}
          <div className="om-dialog-section">
            <p className="om-section-label">Thanh toán</p>
            <div className="om-info-rows">
              <div className="om-info-row">
                <span>Phương thức</span>
                <strong>{order.method || 'Thu hộ khi nhận'}{order.paymentMethod ? ` (${order.paymentMethod})` : ''}</strong>
              </div>
              <div className="om-info-row">
                <span>Trạng thái</span>
                <StatusBadge value={order.paymentStatus || order.payment} />
              </div>
              {order.paymentDeadline && (
                <div className="om-info-row">
                  <span>Hạn thanh toán</span>
                  <strong>{order.paymentDeadline}</strong>
                </div>
              )}
              <div className="om-info-row om-row-separator">
                <span>Tiền hàng</span>
                <strong>{formatPrice(order.subtotalAmount || order.amount)}</strong>
              </div>
              <div className="om-info-row">
                <span>Phí vận chuyển</span>
                <strong>{formatPrice(order.shippingFee ?? 30000)}</strong>
              </div>
              {order.couponCode && (
                <div className="om-info-row">
                  <span>Mã giảm giá ({order.couponCode})</span>
                  <strong className="om-discount">-{formatPrice(order.discountAmount || 0)}</strong>
                </div>
              )}
              {(!order.couponCode && order.discountAmount > 0) && (
                <div className="om-info-row">
                  <span>Giảm giá</span>
                  <strong className="om-discount">-{formatPrice(order.discountAmount)}</strong>
                </div>
              )}
              <div className="om-info-row om-total-row">
                <span>Tổng thanh toán</span>
                <strong>{formatPrice(order.totalAmount || order.amount)}</strong>
              </div>
            </div>
          </div>

          {/* Lý do hủy nếu có */}
          {order.cancelReason && (
            <div className="om-dialog-section om-cancel-section">
              <p className="om-section-label">Lý do hủy đơn</p>
              <p className="om-cancel-reason">{order.cancelReason}</p>
            </div>
          )}
        </div>

        <div className="om-dialog-actions">
          <button className="om-button" onClick={onClose}>Đóng</button>
        </div>
      </section>
    </div>
  );
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
    const matchesQuery = `${order.id} ${order.orderCode || ''} ${order.customer} ${order.phone} ${order.product || ''} ${order.customerEmail || ''}`.toLocaleLowerCase('vi').includes(needle);
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
    const rows = [['Mã đơn', 'Mã hệ thống (Code)', 'Khách hàng', 'Số điện thoại', 'Email', 'Số lượng', 'Giá trị', 'Thanh toán', 'Giao hàng', 'Ngày đặt'], ...selected.map((order) => [order.id, order.orderCode || '', order.customer, order.phone, order.customerEmail || '', `${order.quantity} sản phẩm`, order.totalAmount || order.amount, order.payment, order.delivery, order.date])];
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

  return <div className="om-dashboard" data-node-id="58:480"><AdminSidebar /><main className="om-main">
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
        <div className="om-table-scroll"><table className="om-table"><thead data-node-id="58:626"><tr><th className="om-check-cell"><input type="checkbox" aria-label="Chọn tất cả đơn hàng" checked={filteredOrders.length > 0 && filteredOrders.every((order) => selectedIds.includes(order.id))} onChange={toggleAll} /></th><th>Đơn hàng / Số lượng</th><th>Khách hàng</th><th className="align-right">Giá trị đơn</th><th>Thanh toán</th><th>Giao hàng</th><th>Ngày đặt ↓</th><th className="align-right">Thao tác</th></tr></thead><tbody>
          {filteredOrders.map((order, index) => <tr key={order.id} data-node-id={['58:635', '58:659', '58:683', '58:707', '58:731', '58:755', '58:779', '58:803', '58:827'][index]}><td className="om-check-cell"><input type="checkbox" aria-label={`Chọn đơn ${order.id}`} checked={selectedIds.includes(order.id)} onChange={() => toggleOrder(order.id)} /></td><td><div className="om-order-cell"><strong>{order.id}</strong><small>{order.quantity} sản phẩm</small></div></td><td><div className="om-customer-cell"><span>{order.customer}</span><small>{order.phone}</small></div></td><td className="align-right om-amount">{formatPrice(order.amount)}</td><td><div className="om-payment-cell"><StatusBadge value={order.payment} /><small>{order.method}</small></div></td><td><StatusBadge value={order.delivery} /></td><td><div className="om-date-cell"><span>{order.date}</span><small>{order.time}</small></div></td><td><div className="om-row-actions"><button className="om-icon-button" aria-label={`Xem đơn ${order.id}`} onClick={() => setSelectedOrder(order)}><IconEye size={16} /></button><button className="om-icon-button" aria-label={`Thao tác đơn ${order.id}`} onClick={() => { setSelectedOrder(order); }}><IconDots size={17} /></button></div></td></tr>)}
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
