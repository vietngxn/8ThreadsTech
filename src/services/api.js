
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động đính kèm JWT nếu người dùng đã đăng nhập
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const tokenType = localStorage.getItem("tokenType") || "Bearer";

    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý response và lỗi theo ApiResponse của backend
api.interceptors.response.use(
  (response) => {
    const data = response.data;

    // Backend trả HTTP 2xx nhưng nghiệp vụ thất bại
    if (data?.success === false) {
      const error = new Error(data.message || "Yêu cầu thất bại");
      error.response = response;
      error.isApiError = true;

      return Promise.reject(error);
    }

    return response;
  },
  (error) => {
    const responseData = error.response?.data;

    if (responseData?.message) {
      error.message = responseData.message;
    } else if (responseData?.error) {
      error.message = responseData.error;
    } else if (!error.response) {
      error.message = "Không thể kết nối đến máy chủ backend";
    } else if (error.code === "ECONNABORTED") {
      error.message = "Yêu cầu đã hết thời gian chờ";
    }

    return Promise.reject(error);
  }
);

export default api;
