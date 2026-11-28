import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconStar,
} from "@tabler/icons-react";
import { gsap, useGSAP } from "../../lib/gsap";
import { productService } from "../../services/productService";

const REVIEWS_PER_PAGE = 3;

function formatReviewDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return String(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function computeRatingStats(summary, items) {
  if (summary && typeof summary === "object") {
    const total = Number(summary.totalReviews ?? summary.total ?? summary.count ?? items.length) || 0;
    const avgNum = Number(summary.averageRating ?? summary.average ?? summary.avgRating ?? 0);
    const average = Number.isFinite(avgNum) && total > 0 ? avgNum.toFixed(1) : "0.0";
    const rawBreakdown = summary.breakdown || summary.distribution || summary.starCounts;
    const breakdown = Array.isArray(rawBreakdown) && rawBreakdown.length === 5
      ? rawBreakdown
      : [5, 4, 3, 2, 1].map((star) =>
          Number(rawBreakdown?.[star] ?? rawBreakdown?.[String(star)] ?? 0)
        );
    return { average, total, breakdown };
  }

  const total = items.length;
  const average = total > 0
    ? (items.reduce((sum, item) => sum + Number(item.rating || 0), 0) / total).toFixed(1)
    : "0.0";
  const breakdown = [5, 4, 3, 2, 1].map(
    (star) => items.filter((item) => Math.round(Number(item.rating || 0)) === star).length
  );

  return { average, total, breakdown };
}

function RatingCard({ stats, onComingSoon }) {
  return (
    <aside className="rating-card">
      <div className="small-label">ĐIỂM TRUNG BÌNH</div>
      <div className="rating-number">{stats.average}</div>
      <p className="rating-caption">Dựa trên {stats.total} đánh giá</p>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <IconStar key={n} size={18} />
        ))}
      </div>
      <div className="rating-breakdown">
        {stats.breakdown.map((count, index) => (
          <div key={5 - index} className="breakdown-row">
            <strong>{5 - index} sao</strong>
            <span>{count} đánh giá</span>
          </div>
        ))}
      </div>
      <div className="rating-guide">
        <strong>ĐIỀU KIỆN ĐÁNH GIÁ</strong>
        <p>
          Chỉ người mua đã nhận hàng mới có thể gửi đánh giá và bình luận.
          Vui lòng kiểm tra trạng thái đơn hàng tại Đơn hàng của tôi.
        </p>
        <button onClick={() => onComingSoon("Đơn hàng của tôi")}>
          <IconArrowRight size={16} />
          <span>Đơn hàng đã giao → Đánh giá tại Đơn hàng của tôi</span>
        </button>
      </div>
    </aside>
  );
}

function ReviewCard({ review, productName = "" }) {
  const reviewerName = review.reviewerName || review.name || "Khách hàng";
  const displayProduct = review.productName || productName;
  const displayDate = formatReviewDate(review.createdAt || review.date);
  const displayRating = Number(review.rating ?? 5).toFixed(1);
  const displayComment = review.comment || review.text || "";
  const tags = Array.isArray(review.tags) ? review.tags : [];

  return (
    <article className="review-card">
      <div className="review-top">
        <div>
          <strong>{reviewerName}</strong>
          <p>
            Đã mua {displayProduct}
            {displayDate ? ` · ${displayDate}` : ""}
          </p>
        </div>
        <span className="review-score">
          <IconStar size={16} /> {displayRating}
        </span>
      </div>
      <p className="review-text">{displayComment}</p>
      {tags.length > 0 && (
        <div className="review-tags">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
}

export default function ReviewsSection({ onComingSoon, product = null }) {
  const reviewsRef = useRef(null);
  const productId = product?.numericId;

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // Chế độ phân trang client khi backend trả về > 3 đánh giá trong 1 lần
  const isClientPaginated = reviews.length > REVIEWS_PER_PAGE;
  const totalPagesClient = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const visibleReviews = useMemo(() => {
    if (isClientPaginated) {
      const start = page * REVIEWS_PER_PAGE;
      return reviews.slice(start, start + REVIEWS_PER_PAGE);
    }
    return reviews.slice(0, REVIEWS_PER_PAGE);
  }, [reviews, page, isClientPaginated]);

  const showPagination = !loading && (isClientPaginated || hasNext || page > 0);

  const fetchPage = async (targetPage) => {
    if (!productId) return;
    setLoading(true);
    const res = await productService.getProductReviews(productId, {
      page: targetPage,
      size: REVIEWS_PER_PAGE,
    });
    setReviews(res.items);
    setSummary(res.summary);
    setHasNext(res.hasNext);
    setPage(targetPage);
    setLoading(false);
  };

  useEffect(() => {
    if (!productId) {
      setReviews([]);
      setSummary(null);
      setHasNext(false);
      setPage(0);
      return;
    }

    let alive = true;
    setLoading(true);
    setPage(0);

    productService
      .getProductReviews(productId, { page: 0, size: REVIEWS_PER_PAGE })
      .then((res) => {
        if (!alive) return;
        setSummary(res.summary);
        setReviews(res.items);
        setHasNext(res.hasNext);
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [productId]);

  const handlePageChange = (targetPage) => {
    if (targetPage < 0 || targetPage === page || loading) return;
    if (isClientPaginated) {
      if (targetPage >= totalPagesClient) return;
      setPage(targetPage);
      return;
    }
    fetchPage(targetPage);
  };

  const stats = useMemo(() => computeRatingStats(summary, reviews), [summary, reviews]);

  // Danh sách số trang hiển thị
  const pageNumbers = useMemo(() => {
    if (isClientPaginated) {
      return Array.from({ length: totalPagesClient }, (_, i) => i);
    }
    const totalFromSummary = Number(summary?.totalReviews ?? summary?.total ?? summary?.count ?? 0);
    if (totalFromSummary > REVIEWS_PER_PAGE) {
      const totalPages = Math.ceil(totalFromSummary / REVIEWS_PER_PAGE);
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    const maxKnownPage = hasNext ? page + 1 : page;
    return Array.from({ length: maxKnownPage + 1 }, (_, i) => i);
  }, [isClientPaginated, totalPagesClient, summary, hasNext, page]);

  const canGoPrev = page > 0;
  const canGoNext = isClientPaginated ? page < totalPagesClient - 1 : hasNext;

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".section-eyebrow, .reviews h2, .review-intro", {
          autoAlpha: 0,
          y: 35,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: reviewsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".rating-card", {
          autoAlpha: 0,
          x: -40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".review-layout",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".rating-number", {
          scale: 0.5,
          autoAlpha: 0,
          duration: 0.8,
          ease: "back.out(1.8)",
          scrollTrigger: {
            trigger: ".rating-card",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".breakdown-row", {
          autoAlpha: 0,
          x: -15,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".rating-breakdown",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });

      return () => media.revert();
    },
    { scope: reviewsRef }
  );

  return (
    <section ref={reviewsRef} className="reviews" data-node-id="40:3">
      <div className="section-eyebrow">
        <span />
        ĐÁNH GIÁ &amp; BÌNH LUẬN
      </div>
      <h2>Đánh giá từ người mua</h2>
      <p className="review-intro">
        Chỉ người mua đã nhận hàng mới có thể gửi đánh giá và bình luận. Khách chưa đủ điều kiện
        vẫn có thể đọc đánh giá và theo dõi hướng dẫn gửi nhận xét sau khi đơn hàng được giao.
      </p>
      <div className="review-layout">
        <RatingCard stats={stats} onComingSoon={onComingSoon} />
        <div className="review-list">
          {loading ? (
            <article className="review-card">
              <p className="review-text" style={{ margin: 0, color: "#929292" }}>
                Đang tải đánh giá sản phẩm...
              </p>
            </article>
          ) : visibleReviews.length === 0 ? (
            <article className="review-card">
              <p className="review-text" style={{ margin: 0, color: "#929292" }}>
                Chưa có đánh giá nào cho sản phẩm này.
              </p>
            </article>
          ) : (
            visibleReviews.map((review, index) => (
              <ReviewCard
                key={review.id ?? `${review.reviewerName || "review"}-${page}-${index}`}
                review={review}
                productName={product?.name || ""}
              />
            ))
          )}

          {showPagination && (
            <nav className="review-pagination" aria-label="Phân trang đánh giá">
              <span className="review-pagination-info">
                Trang {page + 1}
                {isClientPaginated ? ` / ${totalPagesClient}` : ""}
              </span>
              <div className="review-pagination-controls">
                <button
                  type="button"
                  className="review-page-btn"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!canGoPrev}
                  aria-label="Trang trước"
                >
                  <IconChevronLeft size={15} />
                  <span>Trước</span>
                </button>

                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`review-page-btn${num === page ? " active" : ""}`}
                    onClick={() => handlePageChange(num)}
                    aria-current={num === page ? "page" : undefined}
                  >
                    {num + 1}
                  </button>
                ))}

                <button
                  type="button"
                  className="review-page-btn"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!canGoNext}
                  aria-label="Trang sau"
                >
                  <span>Sau</span>
                  <IconChevronRight size={15} />
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
