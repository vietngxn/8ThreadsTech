import { useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { productService } from "../services/productService";

const STALE_MS = 60_000; // 1 phút dùng lại cache, không gọi lại API
const GC_MS = 10 * 60_000; // giữ cache 10 phút sau khi rời trang

const DEFAULTS = {
  pageNumber: 0,
  pageSize: 9,
  sortBy: "viewCount",
  sortDirection: "desc",
};

// Chuẩn hóa để cùng một bộ lọc luôn ra cùng một cache key
function normalize(params) {
  const merged = { ...DEFAULTS, ...params };
  return Object.fromEntries(
    Object.entries(merged).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );
}

async function loadPage(params) {
  const result = await productService.getProducts(params);
  // getProducts nuốt lỗi và trả { error }, nên ném lại để React Query không cache lỗi
  if (result.error) throw new Error(result.error);
  return result;
}

/**
 * @param params  cùng định dạng cũ (pageNumber, pageSize, search, categoryId, ...)
 * @param options.enabled  false = chưa gọi API (ví dụ chờ danh mục tải xong)
 */
export function useProducts(params = {}, { enabled = true } = {}) {
  const queryClient = useQueryClient();
  const p = normalize(params);
  const keyString = JSON.stringify(p);

  const query = useQuery({
    queryKey: ["products", p],
    queryFn: () => loadPage(p),
    enabled,
    staleTime: STALE_MS,
    gcTime: GC_MS,
    retry: 1,
    refetchOnWindowFocus: false,
    // Chuyển trang / đổi bộ lọc: giữ lưới cũ trên màn hình, không nháy skeleton
    placeholderData: keepPreviousData,
  });

  const totalPages = query.data?.pageInfo?.totalPages ?? 0;

  // Tải trước trang kế tiếp để bấm "Trang sau" là có ngay
  useEffect(() => {
    if (!enabled || !query.data || p.pageNumber + 1 >= totalPages) return;

    const next = { ...p, pageNumber: p.pageNumber + 1 };
    queryClient.prefetchQuery({
      queryKey: ["products", next],
      queryFn: () => loadPage(next),
      staleTime: STALE_MS,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, keyString, totalPages, query.data]);

  return {
    products: query.data?.products ?? [],
    pageInfo: query.data?.pageInfo ?? null,
    isLive: query.data?.isLive ?? false,
    loading: query.isPending, // chỉ true ở lần tải đầu, chưa có dữ liệu nào
    fetching: query.isFetching, // true cả khi đang tải nền (dùng để làm mờ lưới)
    isPlaceholder: query.isPlaceholderData, // đang hiển thị dữ liệu của trang trước
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}
