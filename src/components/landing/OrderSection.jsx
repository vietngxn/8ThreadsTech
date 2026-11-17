import { useState, useEffect } from 'react';
import { IconArrowUpRight, IconShoppingBag } from '@tabler/icons-react';
import { useReveal } from '../../hooks/useReveal';
import { productService } from '../../services/productService';
import keyboard from '../../assets/thread-keyboard.png';

function Label({ children }) {
  return (
    <div className="landing-label">
      <span />
      {children}
    </div>
  );
}

export default function OrderSection({ selectedColor, onComingSoon }) {
  const orderRef = useReveal({ y: 60, stagger: 0.15 });
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let alive = true;
    productService.getProductBySlug('thread-75t')
      .then((res) => {
        if (!alive) return;
        if (res) setProduct(res);
      })
      .catch((err) => console.warn('Lỗi tải sản phẩm OrderSection:', err));

    return () => {
      alive = false;
    };
  }, []);

  const priceText = product?.price ? `${Number(product.price).toLocaleString('vi-VN')} ₫` : '2.490.000 ₫';
  const oldPriceText = product?.oldPrice || '2.790.000 ₫';
  const productName = product?.name || 'THREAD 75';
  const productImage = product?.image || keyboard;

  return (
    <section ref={orderRef} className="landing-section order-section" id="order" data-node-id="36:5410">
      <Label>
        <span className="js-reveal">09 / NHỊP GÕ MỚI BẮT ĐẦU TỪ ĐÂY</span>
      </Label>
      <h2 className="js-reveal">ĐẾN LƯỢT BẠN BẬT CHẤT.</h2>
      <div className="order-grid">
        <img className="js-reveal" src={productImage} alt={`Bàn phím ${productName}`} />
        <div>
          <h3 className="js-reveal">{productName}</h3>
          <p className="js-reveal">{selectedColor} · Linear Red Switch</p>
          <div className="order-price js-reveal">
            <strong>{priceText}</strong>
            {oldPriceText && <del>{oldPriceText}</del>}
          </div>
          <div className="order-buttons js-reveal">
            <a href={`/ban-phim/${product?.slug || 'thread-75t'}`}>
              XEM CHI TIẾT <IconArrowUpRight size={18} />
            </a>
            <a href="/gio-hang">
              <IconShoppingBag size={18} /> THÊM VÀO GIỎ
            </a>
          </div>
          <small className="js-reveal">
            MIỄN PHÍ VẬN CHUYỂN / BẢO HÀNH 24 THÁNG<br />
            ĐỔI MỚI TRONG 7 NGÀY
          </small>
        </div>
      </div>
    </section>
  );
}
