
/**
 * Service tích hợp Chat API với Spring Boot Backend
 */
import api from "./api";

/**
 * Tạo conversationId ngẫu nhiên cho phiên trò chuyện
 */
export function generateConversationId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);

  return `thread_${timestamp}_${randomPart}`;
}

export const chatService = {
  /**
   * Gửi tin nhắn đến backend Spring AI
   */
  async sendMessage(message, conversationId) {
    try {
      const response = await api.post("/api/chat", {
        message,
        conversationId,
      });

      const data = response.data;

      const reply =
        data?.reply ||
        data?.message ||
        data?.content ||
        (typeof data === "string" ? data : "");

      if (!reply) {
        throw new Error(
          "Không nhận được nội dung phản hồi từ trợ lý."
        );
      }

      return reply;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
