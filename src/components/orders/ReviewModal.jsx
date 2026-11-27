import { useState } from "react";
import { IconCheck, IconPlus, IconStar, IconX } from "@tabler/icons-react";
import { productService } from "../../services/productService";
import { authService } from "../../services/authService";

const SUGGESTED_TAGS = [
  "Chất lượng tốt",
  "Giao nhanh",
  "Đóng gói cẩn thận",
  "Đúng mô tả",
  "Gõ êm",
];

const MAX_COMMENT_LENGTH = 2000;
const MAX_TAG_LENGTH = 50;

export default function ReviewModal({
  item,
  onClose,
  onSuccess,
  onAlreadyReviewed,
  onReloadOrder,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [lockedByConflict, setLockedByConflict] = useState(false);

  if (!item) return null;

  const activeStars = hoverRating || rating;

  const toggleSuggestedTag = (tag) => {
    setFieldErrors((prev) => ({ ...prev, tags: "" }));
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    const clean = customTag.trim();
    if (!clean) return;
    if (clean.length > MAX_TAG_LENGTH) {
      setFieldErrors((prev) => ({
        ...prev,
        tags: `Mỗi thẻ không được vượt quá ${MAX_TAG_LENGTH} ký tự.`,
      }));
      return;
    }
    if (!tags.includes(clean)) {
      setTags((prev) => [...prev, clean]);
    }
    setCustomTag("");
    setFieldErrors((prev) => ({ ...prev, tags: "" }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const validate = () => {
    const errs = {};

    if (!item.orderItemId || !item.productId) {
      setGeneralError(
        "Thiếu thông tin sản phẩm hoặc dòng đơn hàng. Vui lòng tải lại trang."
      );
      return false;
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      errs.rating = "Vui lòng chọn số sao đánh giá từ 1 đến 5.";
    }

    if (comment.length > MAX_COMMENT_LENGTH) {
      errs.comment = `Bình luận không được vượt quá ${MAX_COMMENT_LENGTH} ký tự.`;
    }

    const invalidTag = tags.find((t) => t.length > MAX_TAG_LENGTH);
    if (invalidTag) {
      errs.tags = `Mỗi thẻ không được vượt quá ${MAX_TAG_LENGTH} ký tự.`;
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || lockedByConflict) return;

    setGeneralError("");
    if (!authService.isAuthenticated()) {
      window.location.href = "/dang-nhap";
      return;
    }

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        orderItemId: item.orderItemId,
        rating,
        comment: comment.trim() || "",
        tags,
      };

      const res = await productService.createProductReview(item.productId, payload);
      onSuccess?.(item.orderItemId, res?.data, res?.message);
    } catch (error) {
      const status = error?.response?.status;
      const resData = error?.response?.data;
      const msg = resData?.message || error?.message || "Không thể gửi đánh giá.";

      if (status === 401) {
        authService.logout("/dang-nhap");
        return;
      }

      if (status === 400 && resData?.data && typeof resData.data === "object") {
        setFieldErrors(resData.data);
        setGeneralError(msg);
      } else if (msg.includes("đã được đánh giá")) {
        setLockedByConflict(true);
        setGeneralError(msg);
        onAlreadyReviewed?.(item.orderItemId, msg);
      } else if (msg.includes("không thuộc đơn hàng của bạn")) {
        setGeneralError(`${msg}. Vui lòng tải lại trang hoặc đăng nhập lại.`);
      } else if (msg.includes("không thuộc đơn hàng này")) {
        setGeneralError(`${msg}. Đang tải lại dữ liệu đơn hàng...`);
        onReloadOrder?.();
      } else {
        setGeneralError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="review-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <section
        className="review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        <header className="review-modal-header">
          <div>
            <span>ĐÁNH GIÁ SẢN PHẨM</span>
            <h2 id="review-modal-title">
              {item.orderCode ? `Đơn #${item.orderCode}` : "Đánh giá sau khi nhận hàng"}
            </h2>
          </div>
          <button
            type="button"
            className="review-modal-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Đóng"
          >
            <IconX size={18} />
          </button>
        </header>

        <form className="review-modal-body" onSubmit={handleSubmit}>
          <div className="review-product">
            <div className="review-product-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div>
              <strong>{item.name}</strong>
              {item.variant && <span>{item.variant}</span>}
            </div>
          </div>

          <fieldset className="review-rating">
            <legend>Đánh giá của bạn *</legend>
            <div className="review-stars" role="radiogroup" aria-label="Chọn số sao">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={star <= activeStars ? "filled" : ""}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => {
                    setRating(star);
                    setFieldErrors((prev) => ({ ...prev, rating: "" }));
                  }}
                  aria-label={`${star} sao`}
                >
                  <IconStar size={22} aria-hidden="true" />
                </button>
              ))}
              <span className="review-rating-text">{rating}/5 sao</span>
            </div>
            {fieldErrors.rating && (
              <p className="review-field-error">{fieldErrors.rating}</p>
            )}
          </fieldset>

          <div className="review-field-group">
            <div className="review-field-head">
              <label htmlFor="review-comment-input">Nhận xét chi tiết</label>
              <span>{comment.length}/{MAX_COMMENT_LENGTH}</span>
            </div>
            <textarea
              id="review-comment-input"
              className="review-comment"
              placeholder="Chia sẻ trải nghiệm thực tế của bạn về sản phẩm..."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (fieldErrors.comment) {
                  setFieldErrors((prev) => ({ ...prev, comment: "" }));
                }
              }}
              maxLength={MAX_COMMENT_LENGTH}
              rows={4}
              disabled={submitting || lockedByConflict}
            />
            {fieldErrors.comment && (
              <p className="review-field-error">{fieldErrors.comment}</p>
            )}
          </div>

          <div className="review-field-group">
            <div className="review-field-head">
              <label htmlFor="review-tag-input">Thẻ nổi bật (tối đa {MAX_TAG_LENGTH} ký tự/thẻ)</label>
            </div>
            <div className="review-tag-suggestions">
              {SUGGESTED_TAGS.map((tag) => {
                const selected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    className={`review-tag-chip${selected ? " is-selected" : ""}`}
                    onClick={() => toggleSuggestedTag(tag)}
                    disabled={submitting || lockedByConflict}
                  >
                    {selected && <IconCheck size={12} />}
                    {tag}
                  </button>
                );
              })}
            </div>

            <div className="review-tag-custom">
              <input
                id="review-tag-input"
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                maxLength={MAX_TAG_LENGTH}
                placeholder="Thêm thẻ khác (ví dụ: Bàn phím chắc chắn)..."
                disabled={submitting || lockedByConflict}
              />
              <button
                type="button"
                className="order-button order-button--secondary"
                onClick={handleAddCustomTag}
                disabled={submitting || lockedByConflict || !customTag.trim()}
              >
                <IconPlus size={14} /> Thêm
              </button>
            </div>

            {tags.length > 0 && (
              <div className="review-selected-tags">
                {tags.map((tag) => (
                  <span key={tag} className="review-selected-tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => prev.filter((t) => t !== tag))
                      }
                      aria-label={`Xóa thẻ ${tag}`}
                      disabled={submitting || lockedByConflict}
                    >
                      <IconX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {fieldErrors.tags && (
              <p className="review-field-error">{fieldErrors.tags}</p>
            )}
          </div>

          {generalError && (
            <div className="review-error-banner" role="alert">
              {generalError}
            </div>
          )}

          <footer className="review-modal-footer">
            <button
              type="button"
              className="order-button order-button--secondary"
              onClick={onClose}
              disabled={submitting}
            >
              ĐÓNG
            </button>
            <button
              type="submit"
              className="order-button order-button--primary"
              disabled={submitting || lockedByConflict || rating < 1 || rating > 5}
            >
              {lockedByConflict
                ? "ĐÃ ĐÁNH GIÁ"
                : submitting
                  ? "ĐANG GỬI..."
                  : "GỬI ĐÁNH GIÁ"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
