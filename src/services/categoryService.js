import api from "./api";

const CACHE_KEY = "parentCategories";

export const categoryService = {
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