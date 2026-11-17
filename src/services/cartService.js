/**
 * cartService.js — Quản lý giỏ hàng đồng bộ qua LocalStorage và sự kiện trình duyệt
 */
const STORAGE_KEY = "8threads_cart";
const CART_EVENT = "8threads_cart_updated";

function notifyUpdate() {
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export const cartService = {
  /**
   * Lấy danh sách sản phẩm trong giỏ hàng
   */
  getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Lưu giỏ hàng
   */
  saveCart(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      notifyUpdate();
    } catch (err) {
      console.warn("Lỗi lưu giỏ hàng:", err);
    }
  },

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  addToCart(product, options = {}) {
    const items = this.getCart();
    const id = product.slug || String(product.numericId || product.id);
    const existingIndex = items.findIndex((item) => item.id === id);

    const qty = options.quantity || 1;

    if (existingIndex > -1) {
      items[existingIndex].quantity += qty;
    } else {
      const firstColor = product.colors?.[0] || {};
      const newItem = {
        id,
        slug: product.slug || id,
        name: product.name,
        color: options.color || firstColor.name || "Bạc ánh trăng",
        switch: options.switch || firstColor.switchDesc || product.switch || "Linear Red Switch",
        specs: product.specs || (product.features?.slice(0, 3).join("  /  ") || "Hot-swap  /  3 chế độ"),
        price: Number(options.price ?? product.price ?? 2490000),
        oldPrice: product.oldPrice ? Number(String(product.oldPrice).replace(/[^\d]/g, "")) : null,
        image: options.image || product.image || "",
        quantity: qty,
      };
      items.push(newItem);
    }

    this.saveCart(items);
  },

  /**
   * Thay đổi số lượng
   */
  changeQuantity(id, delta) {
    const items = this.getCart();
    const updated = items
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    this.saveCart(updated);
    return updated;
  },

  /**
   * Xóa 1 sản phẩm khỏi giỏ
   */
  removeItem(id) {
    const items = this.getCart().filter((item) => item.id !== id);
    this.saveCart(items);
    return items;
  },

  /**
   * Xóa toàn bộ giỏ hàng
   */
  clearCart() {
    this.saveCart([]);
  },

  /**
   * Tính tổng số lượng sản phẩm
   */
  getTotalQuantity() {
    return this.getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
  },

  /**
   * Tính tổng tiền
   */
  getSubtotal() {
    return this.getCart().reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  },

  /**
   * Lắng nghe sự kiện cập nhật giỏ hàng
   */
  subscribe(callback) {
    const handler = () => callback(this.getCart());
    window.addEventListener(CART_EVENT, handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener(CART_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};

