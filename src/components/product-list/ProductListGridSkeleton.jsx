/**
 * Skeleton card hiển thị trong lúc chờ load sản phẩm từ API.
 * Giữ đúng layout của ProductListGrid để không có layout shift.
 */
export function ProductCardSkeleton() {
  return (
    <article className="pl-product pl-skeleton" aria-hidden="true">
      <div className="pl-product-image pl-skeleton-image">
        <div className="pl-skeleton-block" />
      </div>
      <div className="pl-product-info">
        <div className="pl-product-title">
          <div className="pl-skeleton-line" style={{ width: "65%", height: 18 }} />
          <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="pl-skeleton-swatch" />
            ))}
          </div>
        </div>
        <div className="pl-skeleton-line" style={{ width: "80%", height: 12, marginTop: 10 }} />
        <div className="pl-skeleton-line" style={{ width: "55%", height: 10, marginTop: 7 }} />
        <div className="pl-price-row" style={{ marginTop: 14 }}>
          <div className="pl-skeleton-line" style={{ width: 90, height: 20 }} />
          <div className="pl-skeleton-btn" />
        </div>
      </div>
    </article>
  );
}

/**
 * Grid skeleton — hiển thị N card placeholder giống layout ProductListGrid
 */
export default function ProductListGridSkeleton({ count = 9 }) {
  return (
    <div className="pl-grid" data-node-id="3:854">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

