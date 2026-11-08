/**
 * Service xử lý gọi API xác thực (Authentication)
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Helper gửi request JSON và chuẩn hóa response
 */
async function sendRequest(endpoint, payload) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.error ||
        `Yêu cầu thất bại (Mã lỗi ${response.status})`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Không thể kết nối đến máy chủ backend (http://localhost:8080). Vui lòng kiểm tra lại backend."
      );
    }
    throw error;
  }
}

export const authService = {
  /**
   * Đăng ký tài khoản (UC01)
   * @param {{ fullName: string, email: string, password: string }} data
   */
  async register({ fullName, email, password }) {
    return await sendRequest("/api/auth/register", {
      fullName,
      email,
      password,
    });
  },

  /**
   * Xác thực OTP qua email (UC01)
   * @param {{ email: string, otp: string, purpose: string }} data
   */
  async verifyEmail({ email, otp, purpose = "REGISTER" }) {
    return await sendRequest("/api/auth/verify-email", {
      email,
      otp,
      purpose,
    });
  },

  /**
   * Đăng nhập (UC02)
   * @param {{ email: string, password: string }} data
   */
  async login({ email, password }) {
    const result = await sendRequest("/api/auth/login", {
      email,
      password,
    });

    // Lưu token và thông tin user vào localStorage nếu thành công
    if (result?.data?.accessToken) {
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("tokenType", result.data.tokenType || "Bearer");
      if (result.data.user) {
        localStorage.setItem("currentUser", JSON.stringify(result.data.user));
      }
    }

    return result;
  },

  /**
   * Lấy token hiện tại
   */
  getToken() {
    return localStorage.getItem("accessToken");
  },

  /**
   * Lấy user hiện tại
   */
  getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Đăng xuất
   */
  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("currentUser");
  },
};

