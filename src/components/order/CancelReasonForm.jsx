import { useState } from "react";

// Danh sách lý do theo đặc tả UC35 bước 5
export const CANCEL_REASONS = [
  "Đổi ý, không muốn mua nữa",
  "Đặt nhầm sản phẩm",
  "Tìm thấy giá rẻ hơn",
  "Muốn thay đổi địa chỉ giao hàng",
  "Thời gian giao hàng quá lâu",
];

const OTHER = "__other__";

/**
 * Form hủy đơn: chọn lý do (bắt buộc, UC35 luồng 5.1) rồi xác nhận.
 * onConfirm(reason) trả Promise; ném lỗi thì form hiển thị thông báo.
 */
export default function CancelReasonForm({ onConfirm, onClose }) {
  const [choice, setChoice] = useState("");
  const [otherText, setOtherText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reason = choice === OTHER ? otherText.trim() : choice;

  const handleConfirm = async () => {
    if (!reason) {
      setError("Vui lòng chọn lý do hủy đơn.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onConfirm(reason);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Không thể hủy đơn hàng.");
      setSubmitting(false);
    }
  };

  return (
    <div
      className="order-cancel-confirm"
      role="group"
      aria-label="Chọn lý do hủy đơn hàng"
      style={{ flexDirection: "column", alignItems: "stretch", gap: 10, width: "100%" }}
    >
      <span>Vì sao bạn muốn hủy đơn này?</span>

      <select
        value={choice}
        onChange={(e) => {
          setChoice(e.target.value);
          setError("");
        }}
        disabled={submitting}
        style={fieldStyle}
      >
        <option value="">-- Chọn lý do --</option>
        {CANCEL_REASONS.map((text) => (
          <option key={text} value={text}>
            {text}
          </option>
        ))}
        <option value={OTHER}>Lý do khác...</option>
      </select>

      {choice === OTHER && (
        <textarea
          value={otherText}
          onChange={(e) => {
            setOtherText(e.target.value);
            setError("");
          }}
          maxLength={1000}
          rows={3}
          placeholder="Nhập lý do của bạn"
          disabled={submitting}
          style={fieldStyle}
        />
      )}

      {error && (
        <p role="alert" style={{ color: "#ef4444", margin: 0 }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        {/* Nút đầu tiên có viền đỏ theo CSS sẵn có (button:first-of-type) */}
        <button type="button" onClick={handleConfirm} disabled={submitting}>
          {submitting ? "Đang hủy..." : "Xác nhận hủy"}
        </button>
        <button type="button" onClick={onClose} disabled={submitting}>
          Giữ đơn
        </button>
      </div>
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  padding: "8px 10px",
  color: "inherit",
  background: "transparent",
  border: "1px solid #3f3f46",
  borderRadius: 4,
  font: "inherit",
};