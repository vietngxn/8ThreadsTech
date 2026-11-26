function SectionHeading({ number, children }) {
  return <div className="order-section-heading"><span>{number}</span><h2>{children}</h2></div>;
}

export default function OrderDelivery({ order }) {
  return (
    <section className="order-delivery">
      <SectionHeading number="02">THÔNG TIN NHẬN HÀNG</SectionHeading>
      <div className="order-delivery-details">
        <div>
          <span>THÔNG TIN ĐẶT HÀNG</span>
          <strong>{order?.customerName}</strong>
          <p>{order?.customerPhone}</p>
          <p>{order?.customerEmail}</p>
        </div>
        <div>
          <strong>Địa chỉ giao hàng</strong>
          <p>{order?.deliveryAddress}</p>
          {order?.customerNote && <p>Ghi chú: {order.customerNote}</p>}
        </div>
      </div>
    </section>
  );
}
