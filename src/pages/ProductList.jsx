import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import ProductListIntro from "../components/product-list/ProductListIntro";
import ProductListSidebar from "../components/product-list/ProductListSidebar";
import ProductListToolbar from "../components/product-list/ProductListToolbar";
import ProductListGrid from "../components/product-list/ProductListGrid";
import ProductListEmpty from "../components/product-list/ProductListEmpty";
import ProductListPagination from "../components/product-list/ProductListPagination";
import ProductListFooter from "../components/product-list/ProductListFooter";
import thread75 from "../assets/list-thread-75.png";
import thread65 from "../assets/list-thread-65.png";
import thread98 from "../assets/list-thread-98.png";
import thread80Pro from "../assets/list-thread-80-pro.png";
import thread60He from "../assets/list-thread-60-he.png";
import thread75Air from "../assets/list-thread-75-air.png";
import thread65Lite from "../assets/list-thread-65-lite.png";
import thread87 from "../assets/list-thread-87.png";
import thread100 from "../assets/list-thread-100.png";

const products = [
  { id: "thread-75", nodeId: "3:856", name: "THREAD 75", variant: "Bạc ánh trăng · Linear Red Switch", specs: "75% / Nhôm CNC / 3 chế độ", price: 2490000, oldPrice: "2.790.000 đ", image: thread75, imageFrameId: "3:857", imageNodeId: "3:858", badge: "MỚI RA MẮT", colors: ["#c8c9ca", "#393b3d", "#a82125"], layout: "75%", connection: "3 chế độ kết nối", switch: "Linear" },
  { id: "thread-65", nodeId: "3:879", name: "THREAD 65", variant: "Đen nguyên bản · Linear Switch", specs: "65% / Hot-swap / 3 chế độ", price: 1890000, availability: "Có sẵn · Giao trong 24h", image: thread65, imageFrameId: "3:880", imageNodeId: "3:881", badge: "BÁN CHẠY", colors: ["#393b3d", "#c8c9ca"], layout: "65%", connection: "3 chế độ kết nối", switch: "Linear" },
  { id: "thread-98", nodeId: "3:901", name: "THREAD 98", variant: "Trắng sương · Tactile Brown Switch", specs: "98% / Phím số / 3 chế độ", price: 2190000, oldPrice: "2.490.000 đ", image: thread98, imageFrameId: "3:902", imageNodeId: "3:903", badge: "TIẾT KIỆM 300K", colors: ["#d8d2bf", "#393b3d"], layout: "98%", connection: "3 chế độ kết nối", switch: "Tactile" },
  { id: "thread-80-pro", nodeId: "3:924", name: "THREAD 80 PRO", variant: "Xám titan · Linear Silver Switch", specs: "TKL 80% / Nhôm CNC / 8.000 Hz", price: 3290000, availability: "Có sẵn · Giao trong 24h", image: thread80Pro, imageFrameId: "3:925", imageNodeId: "3:926", badge: "HIỆU NĂNG CAO", colors: ["#c8c9ca", "#393b3d"], layout: "80% / TKL", connection: "Có dây USB-C", switch: "Linear" },
  { id: "thread-60-he", nodeId: "3:946", name: "THREAD 60 HE", variant: "Đỏ dung nham · Switch từ tính", specs: "60% / Rapid Trigger / 8.000 Hz", price: 2790000, availability: "Có sẵn · Giao trong 24h", image: thread60He, imageFrameId: "3:947", imageNodeId: "3:948", badge: "MỚI RA MẮT", colors: ["#a82125", "#393b3d"], layout: "60% / 65%", connection: "Có dây USB-C", switch: "Magnetic" },
  { id: "thread-75-air", nodeId: "3:968", name: "THREAD 75 AIR", variant: "Xanh khói · Low-profile Switch", specs: "75% / Siêu mỏng / Bluetooth 5.3", price: 1990000, availability: "Có sẵn · Giao trong 24h", image: thread75Air, imageFrameId: "3:969", imageNodeId: "3:970", badge: "MỎNG NHẸ", colors: ["#738391", "#c8c9ca"], layout: "75%", connection: "Không dây Bluetooth", switch: "Linear" },
  { id: "thread-65-lite", nodeId: "3:991", name: "THREAD 65 LITE", variant: "Kem cát · Linear Red Switch", specs: "65% / Gasket mount / Hot-swap", price: 1290000, oldPrice: "1.490.000 đ", image: thread65Lite, imageFrameId: "3:992", imageNodeId: "3:993", badge: "GIÁ TỐT", colors: ["#d8d2bf", "#393b3d"], layout: "65%", connection: "Có dây USB-C", switch: "Linear" },
  { id: "thread-87", nodeId: "3:1013", name: "THREAD 87", variant: "Đen carbon · Tactile Brown Switch", specs: "TKL 87 phím / RGB / Hot-swap", price: 1690000, availability: "Có sẵn · Giao trong 24h", image: thread87, imageFrameId: "3:1014", imageNodeId: "3:1015", badge: "ĐƯỢC YÊU THÍCH", colors: ["#393b3d", "#c8c9ca"], layout: "80% / TKL", connection: "Có dây USB-C", switch: "Tactile" },
  { id: "thread-100", nodeId: "3:1035", name: "THREAD 100", variant: "Bạc tinh vân · Linear Red Switch", specs: "100% / Phím số / 3 chế độ", price: 2590000, availability: "Có sẵn · Giao trong 24h", image: thread100, imageFrameId: "3:1036", imageNodeId: "3:1037", badge: "LÀM VIỆC CHUYÊN SÂU", colors: ["#c8c9ca", "#393b3d"], layout: "98% / 100%", connection: "3 chế độ kết nối", switch: "Linear" },
];

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [sort, setSort] = useState("featured");
  const [category, setCategory] = useState("Tất cả bàn phím");
  const [filters, setFilters] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    const filtered = products.filter((product) => {
      const matchesQuery = `${product.name} ${product.variant} ${product.specs}`.toLocaleLowerCase("vi").includes(normalizedQuery);
      const matchesCategory = category === "Tất cả bàn phím" || (category === "Bàn phím gaming" ? product.switch === "Magnetic" : category === "Bàn phím low-profile" ? product.name.includes("AIR") : true);
      const matchesStock = !inStockOnly || Boolean(product.availability);
      const matchesFilters = filters.every((filter) => {
        if (filter.startsWith("Dưới")) return product.price < 1500000;
        if (filter.startsWith("1.500.000")) return product.price >= 1500000 && product.price <= 2500000;
        if (filter.startsWith("Trên")) return product.price > 2500000;
        if (filter.includes("60% / 65%")) return /60%|65%/.test(product.layout);
        if (filter.startsWith("75%")) return product.layout.includes("75%");
        if (filter.includes("80% / TKL")) return /80%|TKL/.test(product.layout);
        if (filter.includes("98% / 100%")) return /98%|100%/.test(product.layout);
        if (filter.startsWith("3 chế độ")) return product.connection === "3 chế độ kết nối";
        if (filter.startsWith("Không dây")) return product.connection === "Không dây Bluetooth";
        if (filter.startsWith("Có dây")) return product.connection === "Có dây USB-C";
        if (filter.startsWith("Linear")) return product.switch === "Linear";
        if (filter.startsWith("Tactile")) return product.switch === "Tactile";
        if (filter.startsWith("Magnetic")) return product.switch === "Magnetic";
        return true;
      });
      return matchesQuery && matchesCategory && matchesStock && matchesFilters;
    });
    if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [category, filters, inStockOnly, query, sort]);

  const toggleFilter = (value) => {
    setFilters((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const resetFilters = () => {
    setFilters([]);
    setCategory("Tất cả bàn phím");
    setQuery("");
    setInStockOnly(false);
  };

  const handleAddToCart = () => {
    setCartCount((count) => count + 1);
  };

  return (
    <div className="product-list" data-node-id="3:708">
      <Navbar
        quantity={cartCount}
        onSearch={(searchQuery) => {
          setQuery(searchQuery);
          document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      
      <main id="top">
        <ProductListIntro />
        
        <section className="pl-catalog" id="products" data-node-id="3:753">
          <ProductListSidebar
            category={category}
            filters={filters}
            inStockOnly={inStockOnly}
            onCategoryChange={setCategory}
            onFilterToggle={toggleFilter}
            onStockToggle={setInStockOnly}
          />
          
          <div className="pl-results" data-node-id="3:842">
            <ProductListToolbar
              query={query}
              sort={sort}
              visibleCount={visibleProducts.length}
              onQueryChange={setQuery}
              onSortChange={setSort}
            />
            
            {visibleProducts.length ? (
              <>
                <ProductListGrid products={visibleProducts} onAddToCart={handleAddToCart} />
                <ProductListPagination visibleCount={visibleProducts.length} />
              </>
            ) : (
              <ProductListEmpty onReset={resetFilters} />
            )}
          </div>
        </section>
      </main>
      
      <ProductListFooter />
    </div>
  );
}
