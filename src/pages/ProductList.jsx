
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import ProductListIntro from "../components/product-list/ProductListIntro";
import ProductListSidebar from "../components/product-list/ProductListSidebar";
import ProductListToolbar from "../components/product-list/ProductListToolbar";
import ProductListGrid from "../components/product-list/ProductListGrid";
import ProductListEmpty from "../components/product-list/ProductListEmpty";
import ProductListPagination from "../components/product-list/ProductListPagination";
import ProductListFooter from "../components/product-list/ProductListFooter";
import ProductListGridSkeleton from "../components/product-list/ProductListGridSkeleton";

import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";

import { useProducts } from "../hooks/useProducts";
import {
  CATEGORY_MAP,
  FILTER_GROUPS,
  convertFiltersToParams,
} from "../constants/productFilters";

const PAGE_SIZE = 9;

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  // Lấy slug danh mục từ URL
  const categorySlug = pathname.split("/")[1];

  // Danh sách danh mục cha từ Backend
  const [parentCategories, setParentCategories] = useState(() =>
    categoryService.getCachedParentCategories()
  );

  useEffect(() => {
    categoryService.getParentCategories()
      .then(setParentCategories)
      .catch(console.error);
  }, []);

  // Tìm danh mục đang truy cập
  const currentCategory = parentCategories.find(
    (item) => item.slug === categorySlug
  );

  const categoryName = currentCategory?.name ?? "Bàn phím";

  const [query, setQuery] = useState(
    () => searchParams.get("q") || ""
  );

  const [sort, setSort] = useState("featured");
  const [category, setCategory] = useState("Tất cả bàn phím");
  const [filters, setFilters] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
    setFilters([]);
    setInStockOnly(false);
    setSort("featured");
    setCategory("Tất cả bàn phím");
  }, [categorySlug]);

  // Danh mục con + số sản phẩm thật từ backend
  const [filterCategories, setFilterCategories] = useState({ total: null, items: [] });

  useEffect(() => {
    // Trang danh mục: chờ danh mục cha tải xong rồi mới hỏi BE
    if (categorySlug !== "san-pham" && !currentCategory) return undefined;

    let alive = true;
    productService.getCategoryFilters(currentCategory?.id).then((data) => {
      if (alive) setFilterCategories(data);
    });
    return () => {
      alive = false;
    };
  }, [currentCategory?.id, categorySlug]);

  // Tra id danh mục con theo tên (thay CATEGORY_MAP cứng)
  const categoryIdByName = Object.fromEntries(
    filterCategories.items.map((item) => [item.name, item.id])
  );

  // Chuyển lựa chọn sắp xếp thành tham số Backend
  const sortParams = {
    featured: {
      sortBy: "viewCount",
      sortDirection: "desc",
    },
    "price-asc": {
      sortBy: "price",
      sortDirection: "asc",
    },
    "price-desc": {
      sortBy: "price",
      sortDirection: "desc",
    },
  };

  const selectedSort = sortParams[sort] || sortParams.featured;

  // Chuyển bộ lọc giao diện thành query params
  const filterParams = convertFiltersToParams(filters);

  // Nếu người dùng chọn danh mục con ở Sidebar thì ưu tiên danh mục đó.
  // Nếu không, sử dụng danh mục cha lấy từ URL.
  const isKeyboardCategory = categorySlug === "ban-phim";

  const selectedCategoryId = isKeyboardCategory
    ? category !== "Tất cả bàn phím"
      ? categoryIdByName[category] ?? CATEGORY_MAP[category]
      : currentCategory?.id
    : currentCategory?.id ?? (
      categorySlug === "san-pham"
        ? categoryIdByName[category] ?? CATEGORY_MAP[category]
        : undefined
    );

  const params = {
    pageNumber: page,
    pageSize: PAGE_SIZE,

    search: query.trim() || null,
    categoryId: selectedCategoryId,

    ...selectedSort,
    ...filterParams,

    inStock: inStockOnly ? true : null,
  };

  // Backend xử lý tìm kiếm, lọc và phân trang
  const {
    products,
    loading,
    error,
    pageInfo,
  } = useProducts(params);

  // Mỗi nhóm chỉ chọn một bộ lọc
  const toggleFilter = (value) => {
    const group = FILTER_GROUPS.find((item) =>
      item.options.includes(value)
    );

    if (!group) return;

    setFilters((current) => {
      const selectedInGroup = current.find((item) =>
        group.options.includes(item)
      );

      if (selectedInGroup === value) {
        return current.filter((item) => item !== value);
      }

      return [
        ...current.filter((item) => !group.options.includes(item)),
        value,
      ];
    });

    setPage(0);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(0);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(0);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(0);
  };

  const handleStockChange = (value) => {
    setInStockOnly(value);
    setPage(0);
  };

  const resetFilters = () => {
    setFilters([]);
    setCategory("Tất cả bàn phím");
    setQuery("");
    setInStockOnly(false);
    setSort("featured");
    setPage(0);
  };

  const handleAddToCart = () => {
    setCartCount((count) => count + 1);
  };

  return (
    <div className="product-list" data-node-id="3:708">
      <Navbar
        quantity={cartCount}
        onSearch={(searchQuery) => {
          handleQueryChange(searchQuery);

          document
            .querySelector("#products")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <main id="top">
        <ProductListIntro
          total={filterCategories.total}
          name={categoryName}
        />

        <section
          className="pl-catalog"
          id="products"
          data-node-id="3:753"
        >
          <ProductListSidebar
            categoryTitle={`DÒNG ${categoryName.toUpperCase()}`}
            allLabel={`Tất cả ${categoryName.toLowerCase()}`}
            categories={filterCategories.items}
            totalCount={filterCategories.total}
            category={category}
            filters={filters}
            inStockOnly={inStockOnly}
            onCategoryChange={handleCategoryChange}
            onFilterToggle={toggleFilter}
            onStockToggle={handleStockChange}
          />

          <div className="pl-results" data-node-id="3:842">
            <ProductListToolbar
              query={query}
              sort={sort}
              visibleCount={pageInfo?.totalElements || 0}
              onQueryChange={handleQueryChange}
              onSortChange={handleSortChange}
            />

            {loading ? (
              <ProductListGridSkeleton count={PAGE_SIZE} />
            ) : error ? (
              <div className="pl-error">
                Không thể tải sản phẩm. Vui lòng thử lại.
              </div>
            ) : products.length > 0 ? (
              <>
                <ProductListGrid
                  products={products}
                  onAddToCart={handleAddToCart}
                />

                <ProductListPagination
                  pageInfo={pageInfo}
                  onPageChange={setPage}
                />
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
