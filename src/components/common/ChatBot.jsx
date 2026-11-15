import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconX,
  IconSend,
  IconRefresh,
  IconArrowRight,
  IconHelpCircle,
} from "@tabler/icons-react";
import logo from "../../assets/thread-logo.png";
import { chatService, generateConversationId } from "../../services/chatService";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "bot",
    text: "Xin chào bạn! 👋 Đội ngũ **8Threads** có thể giúp gì cho bạn hôm nay? Chúng mình sẵn sàng tư vấn chọn mẫu bàn phím cơ, loại switch hoặc hỗ trợ đơn hàng của bạn.",
    time: "Vừa xong",
    links: [
      { label: "Khám phá THREAD 75", path: "/ban-phim/1" },
      { label: "Danh mục bàn phím", path: "/ban-phim" },
    ],
  },
];

const QUICK_PROMPTS = [
  "Tư vấn bàn phím THREAD 75",
  "Nên chọn switch Linear hay Tactile?",
  "Chính sách bảo hành & giao hàng",
  "Bàn phím tương thích Mac và Win không?",
  "Kiểm tra đơn hàng của tôi",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Khởi tạo conversationId từ sessionStorage để duy trì ngữ cảnh phiên trò chuyện
  const [conversationId, setConversationId] = useState(() => {
    const saved = sessionStorage.getItem("thread_chat_conversation_id");
    if (saved) return saved;
    const newId = generateConversationId();
    sessionStorage.setItem("thread_chat_conversation_id", newId);
    return newId;
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages, isTyping]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setShowTooltip(false);
      return next;
    });
  };

  /**
   * Gửi tin nhắn tới Backend Spring Boot Controller (/api/chat)
   */
  const handleSendMessage = async (textToSend) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || isTyping) return;

    const currentTime = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: messageText,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Gọi API POST /api/chat { message, conversationId }
      const reply = await chatService.sendMessage(messageText, conversationId);

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: reply,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Lỗi khi kết nối Chatbot API:", error);

      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        isError: true,
        text: `**Không thể kết nối**: ${error.message || "Máy chủ không phản hồi."
          }`,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  /**
   * Làm mới cuộc trò chuyện: tạo conversationId mới để reset ChatMemory trên backend
   */
  const handleResetChat = () => {
    const newId = generateConversationId();
    setConversationId(newId);
    sessionStorage.setItem("thread_chat_conversation_id", newId);
    setMessages(INITIAL_MESSAGES);
  };

  const handleLinkClick = (path) => {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      navigate(path);
    }
  };

  /**
   * Render nội dung tin nhắn: hỗ trợ in đậm **text**, danh sách và markdown link [label](url)
   */
  const renderMessageContent = (text) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} style={{ height: "6px" }} />;
      }

      // Tách chuỗi theo **bold** hoặc [link](url)
      const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
      const parsedParts = parts.map((part, pIdx) => {
        if (!part) return null;

        // In đậm
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }

        // Link dạng [label](url)
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          const [, linkText, linkUrl] = linkMatch;
          return (
            <button
              key={pIdx}
              type="button"
              className="thread-chatbot-inline-link"
              onClick={() => handleLinkClick(linkUrl)}
            >
              {linkText}
            </button>
          );
        }

        return part;
      });

      return (
        <div key={idx} style={{ margin: "2px 0" }}>
          {parsedParts}
        </div>
      );
    });
  };

  return (
    <div className="thread-chatbot-wrapper" aria-label="Khung trò chuyện tư vấn">
      {/* Tooltip mời tương tác ban đầu */}
      {showTooltip && !isOpen && (
        <div className="thread-chatbot-tooltip">
          <span>
            Cần tư vấn <span className="highlight">bàn phím cơ</span>? Nhắn tin ngay!
          </span>
          <button
            type="button"
            className="thread-chatbot-tooltip-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            title="Đóng gợi ý"
            aria-label="Đóng gợi ý"
          >
            <IconX size={13} />
          </button>
        </div>
      )}

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="thread-chatbot-window">
          {/* Đường line thương hiệu 8Threads */}
          <div className="thread-chatbot-accent-bar" />

          {/* Header */}
          <div className="thread-chatbot-header">
            <div className="thread-chatbot-header-left">
              <div className="thread-chatbot-avatar">
                <img src={logo} alt="8Threads" className="thread-chatbot-header-logo" />
                <span className="thread-chatbot-avatar-status" />
              </div>
              <div className="thread-chatbot-header-info">
                <div className="thread-chatbot-title-row">
                  <span className="thread-chatbot-title">Tư vấn 8Threads</span>
                  <span className="thread-chatbot-badge">AI</span>
                </div>
                <div className="thread-chatbot-subtitle">
                  <span className="status-text">● Trực tuyến</span>
                </div>
              </div>
            </div>

            <div className="thread-chatbot-header-actions">
              <button
                type="button"
                className="thread-chatbot-action-btn"
                onClick={handleResetChat}
                title="Làm mới cuộc trò chuyện"
                aria-label="Làm mới trò chuyện"
              >
                <IconRefresh size={16} />
              </button>
              <button
                type="button"
                className="thread-chatbot-action-btn"
                onClick={handleToggle}
                title="Đóng cửa sổ chat"
                aria-label="Đóng cửa sổ chat"
              >
                <IconX size={18} />
              </button>
            </div>
          </div>

          {/* Body tin nhắn */}
          <div className="thread-chatbot-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`thread-chatbot-msg ${msg.sender === "bot" ? "bot" : "user"
                  } ${msg.isError ? "error" : ""}`}
              >
                {msg.sender === "bot" && (
                  <div className="thread-chatbot-msg-avatar">
                    <img src={logo} alt="8Threads" className="thread-chatbot-msg-logo" />
                  </div>
                )}
                <div className="thread-chatbot-msg-content">
                  <div className="thread-chatbot-msg-bubble">
                    {renderMessageContent(msg.text)}

                    {/* Nút liên kết điều hướng tĩnh ở tin nhắn chào mừng */}
                    {msg.links && msg.links.length > 0 && (
                      <div className="thread-chatbot-cta-group">
                        {msg.links.map((link, lIdx) => (
                          <button
                            key={lIdx}
                            type="button"
                            className="thread-chatbot-cta-btn"
                            onClick={() => handleLinkClick(link.path)}
                          >
                            <span>{link.label}</span>
                            <IconArrowRight size={13} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="thread-chatbot-msg-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Hiệu ứng đang nhận phản hồi từ bot */}
            {isTyping && (
              <div className="thread-chatbot-msg bot">
                <div className="thread-chatbot-msg-avatar">
                  <img src={logo} alt="8Threads" className="thread-chatbot-msg-logo" />
                </div>
                <div className="thread-chatbot-typing">
                  <span className="thread-chatbot-typing-dot" />
                  <span className="thread-chatbot-typing-dot" />
                  <span className="thread-chatbot-typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Gợi ý câu hỏi nhanh (Chips) */}
          <div className="thread-chatbot-suggestions-bar">
            <span className="thread-chatbot-suggestions-title">
              <IconHelpCircle size={12} />
              Câu hỏi thường gặp
            </span>
            <div className="thread-chatbot-chips">
              {QUICK_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  className="thread-chatbot-chip"
                  disabled={isTyping}
                  onClick={() => handleSendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Footer nhập tin nhắn */}
          <div className="thread-chatbot-footer">
            <form className="thread-chatbot-input-form" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="thread-chatbot-input"
                placeholder={
                  isTyping ? "Trợ lý đang phản hồi..." : "Nhập câu hỏi của bạn..."
                }
                value={inputValue}
                disabled={isTyping}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className={`thread-chatbot-send-btn ${inputValue.trim() && !isTyping ? "active" : ""
                  }`}
                disabled={!inputValue.trim() || isTyping}
                title="Gửi tin nhắn"
                aria-label="Gửi tin nhắn"
              >
                <IconSend size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Nút tròn Trigger nổi góc phải dưới */}
      <button
        type="button"
        className={`thread-chatbot-trigger ${isOpen ? "active" : ""}`}
        onClick={handleToggle}
        aria-label={isOpen ? "Đóng chat tư vấn" : "Mở chat tư vấn 8Threads"}
        title={isOpen ? "Đóng chat" : "Hỗ trợ trực tuyến 8Threads"}
      >
        {isOpen ? (
          <IconX size={22} stroke={2} />
        ) : (
          <img src={logo} alt="8Threads" className="thread-chatbot-trigger-logo" />
        )}

        {!isOpen && (
          <>
            <span className="thread-chatbot-trigger-status" />
            <span className="thread-chatbot-trigger-pulse" />
          </>
        )}
      </button>
    </div>
  );
}
