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
import ProductListGridSkeleton from "../components/product-list/ProductListGridSkeleton";
import { useProducts } from "../hooks/useProducts";

export default function ProductList() {
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [sort, setSort] = useState("featured");
  const [category, setCategory] = useState("Tất cả bàn phím");
  const [filters, setFilters] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const visibleProducts = useMemo(() => {
    if (loading) return [];
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
  }, [category, filters, inStockOnly, query, sort, products, loading]);

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
              visibleCount={loading ? 0 : visibleProducts.length}
              onQueryChange={setQuery}
              onSortChange={setSort}
            />

            {loading ? (
              <ProductListGridSkeleton count={9} />
            ) : visibleProducts.length ? (
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
