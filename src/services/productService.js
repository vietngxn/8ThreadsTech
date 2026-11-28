/**
 * Service gọi API sản phẩm (dữ liệu hoàn toàn từ backend, không còn dữ liệu tĩnh)
 */
import api from "./api";
import { hydrateMissingProductImages } from "../utils/productImage";
const DEFAULT_TAGLINE = "GÕ CHẤT. CHƠI KHÁC.";
const DEFAULT_GLOW = "rgba(200, 201, 202, 0.22)";
const DEFAULT_FEATURES = ["3 chế độ kết nối", "Khung hoàn thiện cao cấp", "Hot-swap linh hoạt"];

const toNumber = (v) => (v != null ? Number(v) : undefined);
const formatVnd = (n) => `${Number(n).toLocaleString("vi-VN")} ₫`;

function hexToGlow(hex, alpha = 0.25) {
  if (typeof hex !== "string") return "";
  const clean = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(clean)) {
    return "";
  }
  const full =
    clean.length === 3
      ? clean
        .split("")
        .map((ch) => ch + ch)
        .join("")
      : clean.slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Suy ra loại switch/kết nối để bộ lọc ở trang danh sách hoạt động
function deriveSwitchType(switchName = "") {
  if (/magnetic|\bHE\b/i.test(switchName)) return "Magnetic";
  if (/tactile|brown/i.test(switchName)) return "Tactile";
  return "Linear";
}

function deriveConnection(highlights = []) {
  const text = highlights.join(" ");
  if (/3 chế độ/i.test(text)) return "3 chế độ kết nối";
  if (/bluetooth|không dây/i.test(text)) return "Không dây Bluetooth";
  if (/có dây|usb/i.test(text)) return "Có dây USB-C";
  return "3 chế độ kết nối";
}

/** Adapter DANH SÁCH: ProductCardResponse -> cấu trúc UI */
export function mapCardToFrontend(card) {
  if (!card) return null;

  const highlights = Array.isArray(card.highlights) ? card.highlights : [];
  const apiColors = Array.isArray(card.colors) ? card.colors : [];
  const image = card.primaryImageUrl || "";
  const compareAtPrice = card.compareAtPrice != null ? Number(card.compareAtPrice) : null;

  const colors = apiColors.map((c, i) => ({
    variantId: c.variantId,
    name: c.name || `Màu ${i + 1}`,
    color: c.hex || "#393b3d",
    switchDesc: c.switchName ? `${c.switchName} · Êm & mượt` : "",
    tagline: DEFAULT_TAGLINE,
    glow: hexToGlow(c.hex) || DEFAULT_GLOW,
    image,
    price: toNumber(c.price),
    compareAtPrice: toNumber(c.compareAtPrice),
  }));

  return {
    id: card.slug || String(card.id),
    numericId: card.id,
    slug: card.slug,
    name: card.name,
    heroWord: "Thread",
    heroNumber: card.name?.match(/\d+/)?.[0] || "75",
    badge: card.specifications?.badge || "MỚI RA MẮT",
    variant: card.subtitle || "",
    specs: highlights.join(" · "),
    features: highlights.length > 0 ? highlights : DEFAULT_FEATURES,
    price: card.price != null ? Number(card.price) : 0,
    oldPrice: compareAtPrice ? formatVnd(compareAtPrice) : null,
    image,
    images: image ? [image] : [],
    inStock: !!card.inStock,
    availability: card.inStock ? "Có sẵn · Giao trong 24h" : "Tạm hết hàng",
    layout: card.layout || "",
    connection: card.connectionType || "",
    switch: card.switchType || "",
    description: "",
    tagline: DEFAULT_TAGLINE,
    statValue: card.statValue || "",
    statLabel: card.statLabel || "",
    colors,
    rawVariants: apiColors.map((c) => ({
      id: c.variantId,
      name: c.name,
      price: toNumber(c.price),
      compareAtPrice: toNumber(c.compareAtPrice),
      attributes: { color: c.name, colorHex: c.hex, switch: c.switchName },
    })),
    defaultVariantId: card.defaultVariantId,
    status: card.status,
    categoryName: card.categoryName,
    brandName: card.brandName,
  };
}

function extractSpecificationBadges(spec) {
  if (!spec) return [];
  let parsed = spec;
  if (typeof spec === "string") {
    const trimmed = spec.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        return [trimmed];
      }
    } else {
      return [trimmed];
    }
  }
  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => (typeof item === "string" ? item.trim() : String(item?.value ?? item?.label ?? "").trim()))
      .filter(Boolean)
      .slice(0, 3);
  }
  if (typeof parsed === "object") {
    const ignoredKeys = new Set(["badge", "tagline", "hz", "pollingRate", "frequency"]);
    return Object.entries(parsed)
      .filter(([k, v]) => !ignoredKeys.has(k) && v != null && String(v).trim() !== "")
      .map(([, v]) => String(v).trim())
      .slice(0, 3);
  }
  return [];
}

/** Adapter CHI TIẾT: ProductDetailResponse (GET /api/products/slug/{slug}) -> cấu trúc UI */
export function mapDetailToFrontend(d) {
  if (!d) return null;

  const variants = Array.isArray(d.variants) ? d.variants : [];
  const hero = d.hero || {};
  const slides = Array.isArray(hero.slides) ? hero.slides : [];
  const def = variants.find((v) => v.id === d.defaultVariantId) || variants[0] || {};
  const image = slides[0] || def.images?.[0] || "";
  const compareAtPrice = def.compareAtPrice != null ? Number(def.compareAtPrice) : null;
  const inStock = variants.some((v) => v.inStock);

  const colors = variants.map((v) => ({
    variantId: v.id,
    name: v.name || v.color || "",
    colorName: v.color || "",
    color: v.colorHex || "",
    switchDesc: v.switchDesc || v.switchName || "",
    tagline: v.tagline || "",
    glow: v.glow || hexToGlow(v.colorHex),
    image: v.images?.[0] || image,
    images: v.images || [],
    inStock: v.inStock,
    price: toNumber(v.price),
    compareAtPrice: toNumber(v.compareAtPrice),
  }));

  const rawSpec = d.specification ?? d.specifications;
  const specObj =
    rawSpec && typeof rawSpec === "object" && !Array.isArray(rawSpec) ? rawSpec : {};
  const specBadges = extractSpecificationBadges(rawSpec);
  const specHz = specObj.hz || specObj.pollingRate || specObj.frequency || "";
  const specTagline = specObj.tagline || "";
  const specBadge = specObj.badge || "";

  return {
    id: d.slug,
    numericId: d.id,
    slug: d.slug,
    name: d.name || "",
    heroWord: hero.titleMain || "",
    heroNumber: hero.titleAccent || "",
    badge: d.badge || specBadge || "",
    variant: def.color ? `${def.color}${def.switchName ? ` · ${def.switchName}` : ""}` : "",
    specs: d.shortDescription || "",
    features: specBadges,
    specifications: rawSpec || null,
    price: def.price != null ? Number(def.price) : null,
    oldPrice: compareAtPrice ? formatVnd(compareAtPrice) : null,
    image,
    images: slides,
    inStock,
    availability: variants.length > 0 ? (inStock ? "Có sẵn · Giao trong 24h" : "Tạm hết hàng") : "",
    layout: "",
    connection: "",
    switch: def.switchName ? deriveSwitchType(def.switchName) : "",
    description: d.description || "",
    tagline: def.tagline || d.tagline || specTagline || "",
    statValue: hero.statValue || specHz || "",
    statLabel: hero.statLabel || (specHz ? "Tần số phản hồi" : ""),
    colors,
    rawVariants: variants,
    defaultVariantId: d.defaultVariantId,
    reviews: d.reviews || null, // { summary, items, hasNext }
    categoryName: d.categoryName || "",
    brandName: d.brandName || "",
  };
}


export const productService = {
  /**
   * Danh sách sản phẩm
   * Lỗi API thì trả danh sách rỗng kèm error
   */
  async getProducts(params = {}) {
    try {
      const paramMap = {
        pageNumber: "page",
        pageSize: "size",
        sortBy: "sortBy",
        sortDirection: "sortDirection",
        search: "search",
        categoryId: "categoryId",
        minPrice: "minPrice",
        maxPrice: "maxPrice",
        layout: "layout",
        connectionType: "connectionType",
        switchType: "switchType",
        inStock: "inStock",
      };

      const queryParams = {};

      Object.entries(paramMap).forEach(([key, apiKey]) => {
        const value = params[key];

        if (value !== undefined && value !== null && value !== "") {
          queryParams[apiKey] = value;
        }
      });

      const response = await api.get("/api/products", {
        params: queryParams,
      });

      const pageData = response.data?.data || {};
      const rawList = Array.isArray(pageData.content)
        ? pageData.content
        : [];

      const list = await hydrateMissingProductImages(rawList, {
        imageField: "primaryImageUrl",
        fetchDetail: (id) => api.get(`/api/products/${id}`),
      });

      return {
        products: list.map(mapCardToFrontend).filter(Boolean),
        pageInfo: pageData,
        isLive: true,
      };
    } catch (error) {
      console.warn(
        "Không thể tải danh sách sản phẩm:",
        error.message
      );

      return {
        products: [],
        pageInfo: null,
        isLive: false,
        error: error.message,
      };
    }
  },

  /**
   * Chi tiết sản phẩm theo slug (hoặc id số)
   * Trả null nếu không tìm thấy hoặc có lỗi
   */
  async getProductBySlug(slug) {
    if (!slug) return null;
    const mergeMissingDetailFields = async (detailData, prefetchedProduct = null) => {
      if (!detailData?.id) return detailData;
      const needsVariantNames =
        Array.isArray(detailData.variants) &&
        detailData.variants.some((v) => !v.name);
      const needsBadge = !detailData.badge;
      const needsSpec = !detailData.specification && !detailData.specifications;
      if (!needsVariantNames && !needsBadge && !needsSpec) {
        return detailData;
      }
      try {
        let rawProduct = prefetchedProduct;
        if (!rawProduct) {
          const rawRes = await api.get(`/api/products/${detailData.id}`);
          rawProduct = rawRes.data?.data;
        }
        if (rawProduct) {
          const rawVariants = rawProduct.variants;
          const nameById = Array.isArray(rawVariants)
            ? new Map(rawVariants.map((rv) => [rv.id, rv.name]))
            : null;
          return {
            ...detailData,
            badge: detailData.badge || rawProduct.badge || "",
            specification: detailData.specification ?? rawProduct.specification ?? null,
            specifications: detailData.specifications ?? rawProduct.specifications ?? null,
            variants:
              nameById && Array.isArray(detailData.variants)
                ? detailData.variants.map((v) => ({
                  ...v,
                  name: v.name || nameById.get(v.id) || "",
                }))
                : detailData.variants,
          };
        }
      } catch {
      }
      return detailData;
    };

    try {
      if (/^\d+$/.test(String(slug).trim())) {
        try {
          const res = await api.get(`/api/products/${slug}`);
          const product = res.data?.data;
          if (product?.slug) {
            const detailRes = await api.get(
              `/api/products/slug/${encodeURIComponent(product.slug)}`
            );
            const merged = await mergeMissingDetailFields(detailRes.data?.data, product);
            return mapDetailToFrontend(merged);
          }
        } catch {
        }
      }

      const response = await api.get(
        `/api/products/slug/${encodeURIComponent(slug)}`
      );
      const merged = await mergeMissingDetailFields(response.data?.data);
      return mapDetailToFrontend(merged);
    } catch (error) {
      console.warn(
        "Không thể tải chi tiết sản phẩm:",
        error.message
      );

      return null;
    }
  },

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  async getProductById(id) {
    if (!id) return null;
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data?.data;
    } catch (error) {
      console.warn("Không thể tải chi tiết sản phẩm theo ID:", error.message);
      return null;
    }
  },

  /**
   * Thêm sản phẩm mới (Admin)
   */
  async createProduct(data) {
    const response = await api.post("/api/products", data);
    return response.data?.data;
  },

  /**
   * Cập nhật thông tin sản phẩm (Admin)
   */
  async updateProduct(id, data) {
    const response = await api.put(`/api/products/${id}`, data);
    return response.data?.data;
  },

  /**
   * Xóa sản phẩm (Admin)
   */
  async deleteProduct(id) {
    const response = await api.delete(`/api/products/${id}`);
    return response.data?.data;
  },

  /**
   * Lấy danh sách đánh giá / bình luận của sản phẩm theo ID
   */
  async getProductReviews(productId, params = {}) {
    if (!productId) return { summary: null, items: [], hasNext: false };
    try {
      const response = await api.get(`/api/products/${productId}/reviews`, {
        params,
      });
      const data = response.data?.data || {};
      return {
        summary: data.summary || null,
        items: Array.isArray(data.items) ? data.items : [],
        hasNext: !!data.hasNext,
      };
    } catch (error) {
      console.warn("Không thể tải đánh giá sản phẩm:", error.message);
      return {
        summary: null,
        items: [],
        hasNext: false,
        error: error.message,
      };
    }
  },

  /**
   * Tạo đánh giá sản phẩm (yêu cầu JWT)
   * POST /api/products/{id}/reviews
   */
  async createProductReview(productId, payload) {
    const response = await api.post(
      `/api/products/${encodeURIComponent(productId)}/reviews`,
      payload
    );
    return response.data;
  },

  async getCategoryFilters(parentId) {
    try {
      const response = await api.get("/api/products/category-filters", {
        params: parentId != null ? { parentId } : {},
      });

      const data = response.data?.data || {};

      return {
        total: data.total ?? null,
        items: Array.isArray(data.items) ? data.items : [],
      };
    } catch (error) {
      console.warn("Không thể tải bộ lọc danh mục:", error.message);
      return { total: null, items: [] };
    }
  },
};
