/**
 * Service xử lý gọi API lấy danh sách và chi tiết sản phẩm
 * Endpoint: GET /api/products
 */
import { PRODUCTS, getProductById as getStaticProductById } from "../data/products";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Hàm adapter chuyển đổi cấu trúc 1 sản phẩm từ Backend API sang cấu trúc Frontend yêu cầu
 * @param {Object} apiProduct - Đối tượng sản phẩm trả về từ API
 * @returns {Object} Đối tượng sản phẩm tương thích với toàn bộ components trong app
 */
export function mapApiProductToFrontend(apiProduct) {
  if (!apiProduct) return null;

  const specs = apiProduct.specifications || {};
  const variants = Array.isArray(apiProduct.variants) ? apiProduct.variants : [];
  const firstVariant = variants[0] || {};
  const images = Array.isArray(apiProduct.images) ? apiProduct.images : [];

  // Lấy ảnh đại diện (ưu tiên isPrimary = true, nếu không lấy ảnh đầu tiên)
  const primaryImgObj = images.find((img) => img.isPrimary) || images[0];
  const primaryImg = primaryImgObj?.imageUrl || "";

  // Map danh sách biến thể (variants) sang mảng colors mà UI cần
  const colors = variants.map((v, index) => {
    const attrs = v.attributes || {};
    return {
      name: v.name || attrs.color || `Màu ${index + 1}`,
      color: attrs.colorHex || "#393b3d",
      switchDesc: attrs.switchDesc || (attrs.switch ? `${attrs.switch} · Êm & mượt` : ""),
      tagline: attrs.tagline || specs.tagline || "GÕ CHẤT. CHƠI KHÁC.",
      glow: attrs.glow || "rgba(200, 201, 202, 0.22)",
      image: images[index]?.imageUrl || primaryImg,
      sku: v.sku,
      price: v.price != null ? Number(v.price) : undefined,
      compareAtPrice: v.compareAtPrice != null ? Number(v.compareAtPrice) : undefined,
      stockQuantity: v.stockQuantity,
    };
  });

  const price = firstVariant.price != null ? Number(firstVariant.price) : 0;
  const compareAtPrice = firstVariant.compareAtPrice != null ? Number(firstVariant.compareAtPrice) : null;
  const oldPriceFormatted = compareAtPrice ? `${compareAtPrice.toLocaleString("vi-VN")} ₫` : null;

  const variantSummary = firstVariant.attributes?.color
    ? `${firstVariant.attributes.color}${firstVariant.attributes.switch ? ` · ${firstVariant.attributes.switch}` : ""}`
    : firstVariant.name || "";

  const inStock = variants.length > 0 ? variants.some((v) => (v.stockQuantity ?? 0) > 0) : true;

  return {
    // Dùng slug làm id để giữ đồng bộ với URL routing hiện tại (/ban-phim/thread-75)
    id: apiProduct.slug || String(apiProduct.id),
    numericId: apiProduct.id,
    slug: apiProduct.slug,
    name: apiProduct.name,
    heroWord: specs.heroWord || "Thread",
    heroNumber: specs.heroNumber || (apiProduct.name.replace(/[^0-9A-Za-z]/g, "").slice(6) || "75"),
    badge: specs.badge || (apiProduct.viewCount > 2000 ? "BÁN CHẠY" : "MỚI RA MẮT"),
    variant: variantSummary,
    specs: specs.specs || apiProduct.shortDescription || "",
    features:
      Array.isArray(specs.features) && specs.features.length > 0
        ? specs.features
        : ["3 chế độ kết nối", "Khung hoàn thiện cao cấp", "Hot-swap linh hoạt"],
    price: price,
    oldPrice: oldPriceFormatted,
    image: primaryImg,
    images: images.map((img) => img.imageUrl),
    availability: inStock ? "Có sẵn · Giao trong 24h" : "Tạm hết hàng",
    layout: specs.layout || "75%",
    connection: specs.connection || "3 chế độ kết nối",
    switch: specs.switchType || "Linear",
    description: apiProduct.description || "",
    tagline: specs.tagline || firstVariant.attributes?.tagline || "GÕ CHẤT. CHƠI KHÁC.",
    statValue: specs.statValue || "1.000 Hz",
    statLabel: specs.statLabel || "KHÔNG DÂY · KHÔNG ĐỘ TRỄ",
    colors:
      colors.length > 0
        ? colors
        : [
          {
            name: "Mặc định",
            color: "#c8c9ca",
            switchDesc: "Linear Red Switch · Êm & mượt",
            tagline: specs.tagline || "GÕ CHẤT. CHƠI KHÁC.",
            image: primaryImg,
            glow: "rgba(200, 201, 202, 0.22)",
          },
        ],
    rawVariants: variants,
    categoryId: apiProduct.categoryId,
    categoryName: apiProduct.categoryName,
    brandId: apiProduct.brandId,
    brandName: apiProduct.brandName,
  };
}

export const productService = {
  /**
   * Lấy danh sách sản phẩm từ backend API (GET /api/products)
   * Trả về danh sách đã được format phù hợp với UI.
   * Nếu không gọi được API, tự động fallback về static PRODUCTS để web không bị gián đoạn.
   */
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber != null) queryParams.append("page", params.pageNumber);
      if (params.pageSize != null) queryParams.append("size", params.pageSize);
      if (params.search) queryParams.append("search", params.search);

      const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const response = await fetch(`${BASE_URL}/api/products${queryStr}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const resJson = await response.json();

      // Hỗ trợ cấu trúc phân trang: { success: true, data: { content: [...] } }
      let rawList = [];
      if (Array.isArray(resJson)) {
        rawList = resJson;
      } else if (Array.isArray(resJson?.data?.content)) {
        rawList = resJson.data.content;
      } else if (Array.isArray(resJson?.data)) {
        rawList = resJson.data;
      } else if (Array.isArray(resJson?.content)) {
        rawList = resJson.content;
      }

      if (rawList.length > 0) {
        const mappedProducts = rawList.map(mapApiProductToFrontend);
        return {
          products: mappedProducts,
          pageInfo: resJson?.data || null,
          isLive: true,
        };
      }

      return { products: PRODUCTS, pageInfo: null, isLive: false };
    } catch (error) {
      console.warn("Lưu ý: Không thể fetch từ backend API (http://localhost:8080/api/products), sử dụng fallback data:", error.message);
      return {
        products: PRODUCTS,
        pageInfo: null,
        isLive: false,
        error: error.message,
      };
    }
  },

  /**
   * Lấy chi tiết 1 sản phẩm theo slug hoặc id
   */
  async getProductById(idOrSlug) {
    if (!idOrSlug) return PRODUCTS[0];

    try {
      const response = await fetch(`${BASE_URL}/api/products/${idOrSlug}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const resJson = await response.json();
        const raw = resJson?.data || resJson;
        if (raw && (raw.name || raw.id)) {
          return mapApiProductToFrontend(raw);
        }
      }
    } catch {
      // Fallback bên dưới
    }

    // Fallback: Tìm trong static PRODUCTS
    return getStaticProductById(idOrSlug);
  },
};
