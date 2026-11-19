
import api from "./api";

export const cartService = {
  async getCart() {
    const response = await api.get("/api/cart");
    return response.data.data || [];
  },

  async addToCart(productVariantId, quantity = 1) {
    const response = await api.post("/api/cart/items", {
      productVariantId,
      quantity,
    });

    return response.data.data;
  },

  getTotalQuantity(items = []) {
    return items.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
  },

  subscribe(callback) {
    window.addEventListener("cart:updated", callback);

    return () => {
      window.removeEventListener("cart:updated", callback);
    };
  },

  notifyUpdate() {
    window.dispatchEvent(new Event("cart:updated"));
  },

  async updateQuantity(cartItemId, quantity) {
  const response = await api.put(
    `/api/cart/items/${cartItemId}`,
    { quantity }
  );

  return response.data.data;
},

async removeItem(cartItemId) {
  const response = await api.delete(
    `/api/cart/items/${cartItemId}`
  );

  return response.data;
},
};
