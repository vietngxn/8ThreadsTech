
import { useEffect, useMemo, useState } from "react";
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
  SORT_CODES,
  convertFiltersToParams,
  filterToSearchParam,
  filtersFromSearchParams,
  sortFromSearchParams,
} from "../constants/productFilters";

const PAGE_SIZE = 9;

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Toàn bộ điều kiện lọc nằm trên URL
  const filters = useMemo(() => filtersFromSearchParams(searchParams), [searchParams]);
  const inStockOnly = searchParams.get("con-hang") === "1";
  const sort = sortFromSearchParams(searchParams);
  const page = Math.max(0, (parseInt(searchParams.get("trang"), 10) || 1) - 1);
  const urlQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(urlQuery);
  const [cartCount, setCartCount] = useState(0);

  // Sửa query string: mutate(next) đổi bản sao rồi đẩy lên URL.
  // Mặc định mỗi lần đổi điều kiện lọc đều về trang 1 (xóa "trang").
  const updateUrl = (mutate, { resetPage = true, replace = false } = {}) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        mutate(next);
        if (resetPage) next.delete("trang");
        return next;
      },
      { replace }
    );
  };

  // URL đổi từ bên ngoài (Back/Forward, Navbar, "Xóa bộ lọc") thì cập nhật ô tìm kiếm
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Gõ xong 400ms mới ghi lên URL (và mới gọi API)
  useEffect(() => {
    const next = query.trim();
    if (next === urlQuery.trim()) return undefined;

    const timer = setTimeout(() => {
      updateUrl(
        (p) => {
          if (next) p.set("q", next);
          else p.delete("q");
        },
        { replace: true }
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  // Danh mục con + số sản phẩm thật từ backend
  const [filterCategories, setFilterCategories] = useState({ total: null, items: [] });
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  useEffect(() => {
    setFiltersLoaded(false);
    setFilterCategories({ total: null, items: [] });

    if (categorySlug !== "san-pham" && !currentCategory) return undefined;

    let alive = true;
    productService.getCategoryFilters(currentCategory?.id).then((data) => {
      if (!alive) return;
      setFilterCategories(data);
      setFiltersLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [currentCategory?.id, categorySlug]);

  // Tra id danh mục con theo tên (thay CATEGORY_MAP cứng)
  const categoryIdByName = Object.fromEntries(
    filterCategories.items.map((item) => [item.name, item.id])
  );

  // Danh mục con đang chọn lấy từ URL: /ban-phim?category=ban-phim-co
  const childSlug = searchParams.get("category");
  const selectedChild = filterCategories.items.find((item) => item.slug === childSlug);
  const category = selectedChild ? selectedChild.name : "Tất cả bàn phím";

  // Có slug trên URL nhưng danh sách danh mục con chưa tải xong
  const childPending = Boolean(childSlug) && !filtersLoaded;

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


  const selectedCategoryId =
    category !== "Tất cả bàn phím"
      ? categoryIdByName[category] ?? CATEGORY_MAP[category]
      : currentCategory?.id;

  const params = {
    pageNumber: page,
    pageSize: PAGE_SIZE,

    search: urlQuery.trim() || null,
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

  // Mỗi nhóm chỉ chọn một lựa chọn; bấm lại lựa chọn đang chọn thì bỏ chọn
  const toggleFilter = (label) => {
    const target = filterToSearchParam(label);
    if (!target) return;

    updateUrl((next) => {
      if (next.get(target.param) === target.code) next.delete(target.param);
      else next.set(target.param, target.code);
    });
  };

  // value = tên danh mục con (hoặc "Tất cả bàn phím") do Sidebar gửi lên
  const handleCategoryChange = (value) => {
    const child = filterCategories.items.find((item) => item.name === value);

    updateUrl((next) => {
      if (child) next.set("category", child.slug);
      else next.delete("category");
    });
  };

  const handleQueryChange = (value) => setQuery(value);

  const handleSortChange = (value) => {
    updateUrl((next) => {
      if (SORT_CODES[value]) next.set("sap-xep", SORT_CODES[value]);
      else next.delete("sap-xep");
    });
  };

  const handleStockChange = (checked) => {
    updateUrl((next) => {
      if (checked) next.set("con-hang", "1");
      else next.delete("con-hang");
    });
  };

  const handlePageChange = (value) => {
    updateUrl(
      (next) => {
        if (value > 0) next.set("trang", String(value + 1));
        else next.delete("trang");
      },
      { resetPage: false }
    );
    document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
  };

  // Xóa toàn bộ: danh mục con, bộ lọc, còn hàng, sắp xếp, trang, từ khóa
  const resetFilters = () => {
    setQuery("");
    setSearchParams({});
  };

  // Trang hiện tại vượt quá số trang còn lại (ví dụ ?trang=99) thì về trang 1
  useEffect(() => {
    if (!loading && !error && page > 0 && products.length === 0) {
      updateUrl((next) => next.delete("trang"), { resetPage: false, replace: true });
    }
  }, [loading, error, page, products.length]); // eslint-disable-line react-hooks/exhaustive-deps


  const handleAddToCart = () => {
    setCartCount((count) => count + 1);
  };

  return (
    <div className="product-list" data-node-id="3:708">
      <Navbar
        quantity={cartCount}
        onSearch={(q) => {
          updateUrl((next) => {
            if (q.trim()) next.set("q", q.trim());
            else next.delete("q");
          });
          document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <main id="top">
        <ProductListIntro
          total={filterCategories.total}
          name={categoryName}
          parentPath={`/${categorySlug}`}
          childName={selectedChild?.name}
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
              loading={loading || childPending}
              onQueryChange={handleQueryChange}
              onSortChange={handleSortChange}
            />

            {loading || childPending ? (
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

                <ProductListPagination pageInfo={pageInfo} onPageChange={handlePageChange} />
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
