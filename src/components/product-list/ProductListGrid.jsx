import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconCheck, IconShoppingBag } from "@tabler/icons-react";

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} đ`;

function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleCardClick = (e) => {
    // Nếu bấm vào nút thêm giỏ hàng thì không điều hướng
    if (e.target.closest("button")) return;
    navigate(`/ban-phim/${product.id}`);
  };

  return (
    <article
      className="pl-product"
      data-node-id={product.nodeId}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="pl-product-image" data-node-id={product.imageFrameId}>
        <Link to={`/ban-phim/${product.id}`} aria-label={`Xem chi tiết ${product.name}`}>
          <img src={product.image} alt={product.name} data-node-id={product.imageNodeId} loading="lazy" />
        </Link>
        <span className={`pl-badge ${product.badge === "MỚI RA MẮT" ? "is-new" : ""}`}>
          {product.badge}
        </span>
        <small>8THREADS / KEYBOARDS</small>
      </div>
      <div className="pl-product-info">
        <div className="pl-product-title">
          <h2>
            <Link to={`/ban-phim/${product.id}`}>{product.name}</Link>
          </h2>
          <div className="pl-swatches" aria-label="Màu sắc">
            {product.colors.map((colorItem, idx) => {
              const hex = typeof colorItem === "string" ? colorItem : colorItem.color;
              const name = typeof colorItem === "object" ? colorItem.name : "Phối màu";
              return <span key={idx} style={{ "--swatch": hex }} title={name} />;
            })}
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
            type="button"
            className={added ? "is-added" : ""}
            aria-label={`Thêm ${product.name} vào giỏ hàng`} 
            onClick={handleAdd}
            title={added ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}
          >
            {added ? (
              <IconCheck size={17} stroke={2.2} />
            ) : (
              <IconShoppingBag size={17} stroke={1.6} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductListGrid({ products, onAddToCart }) {
  return (
    <div className="pl-grid" data-node-id="3:854">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
