import { authService } from "./authService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Tạo một conversationId ngẫu nhiên duy nhất cho phiên trò chuyện
 */
export function generateConversationId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `thread_${timestamp}_${randomPart}`;
}

/**
 * Service tích hợp Chat API với Spring Boot Backend
 * Controller: /api/chat
 * Method: POST
 * Body: { message: string, conversationId: string }
 * Response: { reply: string }
 */
export const chatService = {
  /**
   * Gửi tin nhắn đến backend Spring AI
   * @param {string} message - Nội dung tin nhắn của người dùng
   * @param {string} conversationId - ID phiên trò chuyện để duy trì memory context
   * @returns {Promise<string>} Nội dung phản hồi từ ChatClient
   */
  async sendMessage(message, conversationId) {
    const token = authService.getToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message,
          conversationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMsg =
          errorData?.message ||
          errorData?.error ||
          `Máy chủ trả về mã lỗi: ${response.status}`;
        throw new Error(errorMsg);
      }

      const data = await response.json().catch(() => null);

      // ChatResponse trả về new ChatResponse(reply) -> data.reply
      const reply =
        data?.reply ||
        data?.message ||
        data?.content ||
        (typeof data === "string" ? data : "");

      if (!reply) {
        throw new Error("Không nhận được nội dung phản hồi từ trợ lý.");
      }

      return reply;
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Không thể kết nối đến máy chủ backend (http://localhost:8080). Vui lòng kiểm tra lại dịch vụ backend."
        );
      }
      throw error;
    }
  },
};

