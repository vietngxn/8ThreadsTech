import { IconArrowUpRight, IconShoppingBag } from '@tabler/icons-react';
import { useReveal } from '../../hooks/useReveal';
import keyboard65 from '../../assets/landing-65.png';
import keyboard98 from '../../assets/landing-98.png';
import keyboard60 from '../../assets/landing-60.png';

const products = [
  { 
    id: "thread-65",
    name: "THREAD 65", 
    tag: "NHỎ GỌN", 
    variant: "Đen nguyên bản · Linear Switch", 
    specs: "65% / Hot-swap / 3 chế độ", 
    price: "1.890.000 ₫", 
    image: keyboard65 
  },
  { 
    id: "thread-98",
    name: "THREAD 98", 
    tag: "ĐẦY ĐỦ", 
    variant: "Trắng sương · Tactile Brown Switch", 
    specs: "98% / Phím số / 3 chế độ", 
    price: "2.190.000 ₫", 
    image: keyboard98 
  },
  { 
    id: "thread-60-he",
    name: "THREAD 60 HE", 
    tag: "TỪ TÍNH", 
    variant: "Đỏ dung nham · Switch từ tính", 
    specs: "60% / Rapid Trigger / 8.000 Hz", 
    price: "2.790.000 ₫", 
    image: keyboard60 
  },
];

function Label({ children }) {
  return (
    <div className="landing-label">
      <span />
      {children}
    </div>
  );
}

export default function CollectionSection({ onComingSoon }) {
  const collectionRef = useReveal({ y: 50, stagger: 0.1 });

  return (
    <section ref={collectionRef} className="landing-section collection-section" id="collection" data-node-id="36:5288">
      <div className="collection-heading">
        <div>
          <Label>
            <span className="js-reveal">05 / TÌM ĐÚNG NHỊP CỦA BẠN</span>
          </Label>
          <h2 className="js-reveal">Chất riêng trong từng thao tác</h2>
        </div>
        <a className="js-reveal" href="/ban-phim">
          TẤT CẢ BÀN PHÍM <IconArrowUpRight size={19} />
        </a>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <article className="landing-product js-reveal" key={product.name}>
            <div className="product-image">
              <span>{product.tag}</span>
              <a href={`/ban-phim/${product.id}`} aria-label={`Xem chi tiết ${product.name}`}>
                <img src={product.image} alt={product.name} />
              </a>
              <small>8THREADS / KEYBOARDS</small>
            </div>
            <div className="product-name">
              <h3>
                <a href={`/ban-phim/${product.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {product.name}
                </a>
              </h3>
              <a href={`/ban-phim/${product.id}`} aria-label={`Xem chi tiết ${product.name}`} style={{ color: "inherit" }}>
                <IconArrowUpRight size={20} />
              </a>
            </div>
            <p>{product.variant}</p>
            <small>{product.specs}</small>
            <div className="product-price">
              <strong>{product.price}</strong>
              <button 
                aria-label={`Thêm ${product.name} vào giỏ`} 
                onClick={() => onComingSoon("Giỏ hàng")}
              >
                <IconShoppingBag size={18} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
