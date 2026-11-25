
/**
 * Service xử lý gọi API xác thực (Authentication)
 */
import api from "./api";

export const authService = {
  /**
   * Đăng ký tài khoản (UC01)
   */
  async register({ fullName, email, password }) {
    const response = await api.post("/api/auth/register", {
      fullName,
      email,
      password,
    });

    return response.data;
  },

  /**
   * Xác thực OTP qua email (UC01)
   */
  async verifyEmail({ email, otp, purpose = "REGISTER" }) {
    const response = await api.post("/api/auth/verify-email", {
      email,
      otp,
      purpose,
    });

    return response.data;
  },

  /**
   * Gửi lại mã OTP qua email
   */
  async resendOtp(email) {
    const response = await api.post("/api/auth/resend-otp", {
      email,
    });

    return response.data;
  },

  /**
   * Đăng nhập (UC02)
   */
  async login({ email, password }) {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    const result = response.data;

    // Lưu token và thông tin user nếu đăng nhập thành công
    if (result?.data?.accessToken) {
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem(
        "tokenType",
        result.data.tokenType || "Bearer"
      );

      if (result.data.user) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify(result.data.user)
        );
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
   * Đăng nhập bằng Google
   */
  async googleLogin(idToken) {
    const response = await api.post("/api/auth/google", {
      idToken,
    });

    const result = response.data;

    // Lưu token và thông tin user giống đăng nhập thường
    if (result?.data?.accessToken) {
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem(
        "tokenType",
        result.data.tokenType || "Bearer"
      );

      if (result.data.user) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify(result.data.user)
        );
      }

      window.dispatchEvent(new Event("auth:state-change"));
    }

    return result;
  },

  /**
   * Đăng xuất
   */
  async logout(redirectTo = null) {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // Bỏ qua lỗi mạng khi logout để luôn dọn dẹp local state
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("pending_otp_email");
      window.dispatchEvent(new Event("auth:state-change"));
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    }
  },
};
