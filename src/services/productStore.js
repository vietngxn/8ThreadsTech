/**
 * productStore.js — In-memory cache cho danh sách sản phẩm
 *
 * Module-level variable tồn tại xuyên suốt session (SPA navigation).
 * Không cần Redux / Context — đủ dùng cho cache đơn giản.
 */

let cachedProducts = [];
let cacheIsLive = false;
let cachePageInfo = null;
let isFetched = false; // true sau lần fetch đầu tiên thành công

export const productStore = {
  /** Kiểm tra đã có cache chưa */
  hasCache() {
    return isFetched && cachedProducts.length > 0;
  },

  /** Lấy toàn bộ cache */
  getAll() {
    return cachedProducts;
  },

  /** Tìm sản phẩm theo slug hoặc id (string) */
  findById(idOrSlug) {
    if (!idOrSlug) return null;
    const key = String(idOrSlug).toLowerCase();
    return (
      cachedProducts.find((p) => String(p.id).toLowerCase() === key) ||
      cachedProducts.find((p) => String(p.slug).toLowerCase() === key) ||
      null
    );
  },

  /** Ghi vào cache (gọi sau khi fetch API thành công) */
  set(products, { isLive = false, pageInfo = null } = {}) {
    cachedProducts = products;
    cacheIsLive = isLive;
    cachePageInfo = pageInfo;
    isFetched = true;
  },

  getMeta() {
    return { isLive: cacheIsLive, pageInfo: cachePageInfo };
  },

  /** Xoá cache (dùng khi cần force-refresh) */
  invalidate() {
    cachedProducts = [];
    cacheIsLive = false;
    cachePageInfo = null;
    isFetched = false;
  },
};

