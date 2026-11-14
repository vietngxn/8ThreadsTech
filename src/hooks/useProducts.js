import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import { productStore } from "../services/productStore";

/**
 * Hook fetch danh sách sản phẩm với in-memory cache.
 * - Lần đầu vào trang: gọi API, lưu vào store.
 * - Quay lại trang: đọc từ cache, KHÔNG gọi lại API.
 */
export function useProducts(params = {}) {
  const hasCached = productStore.hasCache();

  // Nếu đã có cache → hiển thị ngay, không cần loading
  const [products, setProducts] = useState(() =>
    hasCached ? productStore.getAll() : []
  );
  const [loading, setLoading] = useState(!hasCached);
  const [error, setError] = useState(null);
  const { isLive, pageInfo: cachedPageInfo } = productStore.getMeta();
  const [isLiveState, setIsLiveState] = useState(isLive);
  const [pageInfo, setPageInfo] = useState(cachedPageInfo);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await productService.getProducts(params);
      const list = result.products || [];
      productStore.set(list, { isLive: result.isLive, pageInfo: result.pageInfo });
      setProducts(list);
      setIsLiveState(result.isLive);
      setPageInfo(result.pageInfo);
      setError(result.error || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Nếu đã có cache thì bỏ qua, không gọi lại API
    if (productStore.hasCache()) return;

    let isMounted = true;
    setLoading(true);

    productService.getProducts(params).then((result) => {
      if (!isMounted) return;
      const list = result.products || [];
      productStore.set(list, { isLive: result.isLive, pageInfo: result.pageInfo });
      setProducts(list);
      setIsLiveState(result.isLive);
      setPageInfo(result.pageInfo);
      setError(result.error || null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
    // Chỉ chạy khi params phân trang thay đổi (không phụ thuộc vào cache)
  }, [params.pageNumber, params.pageSize, params.search]);

  return {
    products,
    loading,
    error,
    isLive: isLiveState,
    pageInfo,
    refetch: fetchProducts,
  };
}
