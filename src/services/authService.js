
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

      window.dispatchEvent(new Event("auth:state-change"));
    }

    return result;
  },

  /**
   * Kiểm tra user có quyền ADMIN (role ADMIN / ROLE_ADMIN / role_id = 2)
   */
  isAdmin(user = this.getCurrentUser()) {
    if (!user) return false;
    if (user.roleId === 2 || user.role_id === 2) return true;
    if (typeof user.role === "string") {
      return user.role === "ADMIN" || user.role === "ROLE_ADMIN";
    }
    if (Array.isArray(user.roles)) {
      return user.roles.some(
        (r) => r === "ADMIN" || r === "ROLE_ADMIN" || r === 2 || r?.id === 2 || r?.code === "ADMIN"
      );
    }
    if (Array.isArray(user.authorities)) {
      return user.authorities.some(
        (a) =>
          (typeof a === "string" && (a === "ADMIN" || a === "ROLE_ADMIN")) ||
          (a?.authority && (a.authority === "ADMIN" || a.authority === "ROLE_ADMIN"))
      );
    }
    return false;
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
   * UC04 bước 1: gửi OTP đặt lại mật khẩu
   */
  async forgotPassword(email) {
    const response = await api.post("/api/auth/forgot-password", { email });
    return response.data;
  },

  /**
   * UC04 bước 2: kiểm tra OTP (chưa đổi mật khẩu)
   */
  async verifyResetOtp({ email, otp }) {
    const response = await api.post("/api/auth/verify-reset-otp", { email, otp });
    return response.data;
  },

  /**
   * UC04 bước 3: đặt mật khẩu mới
   */
  async resetPassword({ email, otp, newPassword, confirmPassword }) {
    const response = await api.post("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  /**
   * UC07: đổi mật khẩu (cần đăng nhập, api.js tự gắn token)
   */
  async changePassword({ currentPassword, newPassword, confirmPassword }) {
    const response = await api.post("/api/auth/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
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
