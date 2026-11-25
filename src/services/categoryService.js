import api from "./api";

const CACHE_KEY = "parentCategories";

export const categoryService = {
  async getAllCategories() {
    try {
      const response = await api.get("/api/categories");
      return response.data?.data || [];
    } catch (error) {
      console.warn("Không thể tải danh sách categories:", error.message);
      return [];
    }
  },

  async getCategoryById(id) {
    const response = await api.get(`/api/categories/${id}`);
    return response.data?.data;
  },

  async createCategory(data) {
    const response = await api.post("/api/categories", data);
    return response.data?.data;
  },

  async updateCategory(id, data) {
    const response = await api.put(`/api/categories/${id}`, data);
    return response.data?.data;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data?.data;
  },

  async getParentCategories() {
    try {
      const response = await api.get("/api/categories/parents");

      const categories = response.data?.data || [];

      localStorage.setItem(CACHE_KEY, JSON.stringify(categories));

      return categories;
    } catch (error) {
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        return JSON.parse(cached);
      }

      throw error;
    }
  },

  getCachedParentCategories() {
    try {
      return JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
    } catch {
      return [];
    }
  },
};