import api from "./api";

/**
 * Service quản trị khách hàng tại /api/admin/customers (yêu cầu JWT ADMIN).
 */
export const adminCustomerService = {
  async getCustomers(params = {}) {
    const queryParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        queryParams[key] = value;
      }
    });

    const response = await api.get("/api/admin/customers", { params: queryParams });
    const data = response.data?.data || {};
    return {
      content: data.content || [],
      pageNumber: data.pageNumber ?? 0,
      pageSize: data.pageSize ?? 9,
      totalElements: data.totalElements ?? 0,
      totalPages: data.totalPages ?? 1,
      last: data.last ?? true,
    };
  },

  async getStats() {
    const response = await api.get("/api/admin/customers/stats");
    return response.data?.data || {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      vipCustomers: 0,
      lockedCustomers: 0,
    };
  },

  async getCustomerDetail(id) {
    const response = await api.get(`/api/admin/customers/${id}`);
    return response.data?.data;
  },

  async updateStatus(id, status, reason) {
    const payload = { status };
    if (reason !== undefined && reason !== null && reason !== "") {
      payload.reason = reason;
    }
    const response = await api.patch(`/api/admin/customers/${id}/status`, payload);
    return response.data?.data;
  },
};
