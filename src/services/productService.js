/**
 * Service gọi API sản phẩm (dữ liệu hoàn toàn từ backend, không còn dữ liệu tĩnh)
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const DEFAULT_TAGLINE = "GÕ CHẤT. CHƠI KHÁC.";
const DEFAULT_GLOW = "rgba(200, 201, 202, 0.22)";
const DEFAULT_FEATURES = ["3 chế độ kết nối", "Khung hoàn thiện cao cấp", "Hot-swap linh hoạt"];

const toNumber = (v) => (v != null ? Number(v) : undefined);
const formatVnd = (n) => `${Number(n).toLocaleString("vi-VN")} ₫`;

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
    glow: DEFAULT_GLOW,
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
    badge: card.badge || "MỚI RA MẮT",
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
    statValue: "1.000 Hz",
    statLabel: "KHÔNG DÂY · KHÔNG ĐỘ TRỄ",
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
  const number = d.name?.match(/\d+/)?.[0];

  const colors = variants.map((v, i) => ({
    variantId: v.id,
    name: v.color || `Màu ${i + 1}`,
    color: v.colorHex || "#393b3d",
    switchDesc: v.switchDesc || (v.switchName ? `${v.switchName} · Êm & mượt` : ""),
    tagline: v.tagline || DEFAULT_TAGLINE,
    glow: v.glow || DEFAULT_GLOW,
    image: v.images?.[0] || image,
    images: v.images || [],
    inStock: v.inStock,
    price: toNumber(v.price),
    compareAtPrice: toNumber(v.compareAtPrice),
  }));

  return {
    id: d.slug,
    numericId: d.id,
    slug: d.slug,
    name: d.name,
    heroWord: hero.titleMain || "Thread",
    heroNumber: hero.titleAccent || number || "75",
    badge: d.badge || "MỚI RA MẮT",
    variant: def.color ? `${def.color}${def.switchName ? ` · ${def.switchName}` : ""}` : "",
    specs: d.shortDescription || "",
    features: d.features?.length ? d.features : DEFAULT_FEATURES,
    price: def.price != null ? Number(def.price) : 0,
    oldPrice: compareAtPrice ? formatVnd(compareAtPrice) : null,
    image,
    images: slides,
    inStock,
    availability: inStock ? "Có sẵn · Giao trong 24h" : "Tạm hết hàng",
    layout: number ? `${number}%` : "",
    connection: "3 chế độ kết nối",
    switch: deriveSwitchType(def.switchName),
    description: d.description || "",
    tagline: def.tagline || DEFAULT_TAGLINE,
    statValue: hero.statValue || "1.000 Hz",
    statLabel: hero.statLabel || "KHÔNG DÂY · KHÔNG ĐỘ TRỄ",
    colors,
    rawVariants: variants,
    defaultVariantId: d.defaultVariantId,
    reviews: d.reviews || null, // { summary, items, hasNext }
    categoryName: d.categoryName,
    brandName: d.brandName,
  };
}

export const productService = {
  /** Danh sách sản phẩm. Lỗi mạng thì trả danh sách rỗng kèm error. */
  
  async getProducts(params = {}) {
    try {
      const q = new URLSearchParams();

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

      Object.entries(paramMap).forEach(([key, apiKey]) => {
        const value = params[key];

        if (value !== undefined && value !== null && value !== "") {
          q.append(apiKey, String(value));
        }
      });

      const res = await fetch(
        `${BASE_URL}/api/products?${q.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const json = await res.json();

      const pageData = json?.data || {};
      const list = Array.isArray(pageData.content)
        ? pageData.content
        : [];

      return {
        products: list.map(mapCardToFrontend).filter(Boolean),
        pageInfo: pageData,
        isLive: true,
      };
    } catch (error) {
      console.warn("Không thể tải danh sách sản phẩm:", error.message);

      return {
        products: [],
        pageInfo: null,
        isLive: false,
        error: error.message,
      };
    }
  },


  /** Chi tiết theo slug. Trả null nếu không tìm thấy hoặc lỗi. */
  async getProductBySlug(slug) {
    if (!slug) return null;
    try {
      const res = await fetch(`${BASE_URL}/api/products/slug/${encodeURIComponent(slug)}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return mapDetailToFrontend(json?.data);
    } catch {
      return null;
    }
  },
};