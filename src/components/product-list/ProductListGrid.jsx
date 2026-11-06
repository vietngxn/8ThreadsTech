import { IconShoppingBag } from "@tabler/icons-react";

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} đ`;

export default function ProductListGrid({ products, onAddToCart }) {
  return (
    <div className="pl-grid" data-node-id="3:854">
      {products.map((product) => (
        <article className="pl-product" key={product.id} data-node-id={product.nodeId}>
          <div className="pl-product-image" data-node-id={product.imageFrameId}>
            <a href={`/ban-phim/${product.id}`} aria-label={`Xem chi tiết ${product.name}`}>
              <img src={product.image} alt={product.name} data-node-id={product.imageNodeId} />
            </a>
            <span className={`pl-badge ${product.badge === "MỚI RA MẮT" ? "is-new" : ""}`}>
              {product.badge}
            </span>
            <small>8THREADS / KEYBOARDS</small>
          </div>
          <div className="pl-product-info">
            <div className="pl-product-title">
              <h2>
                <a href={`/ban-phim/${product.id}`}>{product.name}</a>
              </h2>
              <div className="pl-swatches" aria-label="Màu sắc">
                {product.colors.map((color) => (
                  <span key={color} style={{ "--swatch": color }} />
                ))}
              </div>
            </div>
            <p>{product.variant}</p>
            <small className="pl-specs">{product.specs}</small>
            <div className="pl-price-row">
              <div>
                <strong>{formatPrice(product.price)}</strong>
                <small>
                  {product.oldPrice ? (
                    <del>{product.oldPrice}</del>
                  ) : (
                    product.availability
                  )}
                </small>
              </div>
              <button 
                aria-label={`Thêm ${product.name} vào giỏ hàng`} 
                onClick={() => onAddToCart(product.id)}
              >
                <IconShoppingBag size={17} stroke={1.6} />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
