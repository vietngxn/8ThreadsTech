import { useRef } from "react";
import { IconArrowRight, IconStar } from "@tabler/icons-react";
import { gsap, useGSAP } from "../../lib/gsap";

const reviews = [
  {
    name: "Minh Anh",
    date: "12/03/2025",
    rating: "5.0",
    text: "Bàn phím rất chắc tay, build chất lượng, gõ êm và không bị mỏi tay khi làm việc liên tục. Màu bạc ánh trăng đẹp, phù hợp với setup tối.",
    tags: ["Build chất lượng", "Gõ êm", "Phù hợp làm việc"],
  },
  {
    name: "Quang Huy",
    date: "08/03/2025",
    rating: "4.0",
    text: "Sản phẩm đẹp, cảm giác gõ tốt. Thời gian giao nhanh, đóng hộp cẩn thận. Chỉ hơi tiếc là chưa có sẵn bộ keycap đi kèm trong trang web.",
    tags: ["Thời gian giao nhanh", "Cảm giác gõ tốt", "Đóng hộp tốt"],
  },
  {
    name: "Linh Chi",
    date: "02/03/2025",
    rating: "5.0",
    text: "Thiết kế 75% gọn gàng, không chiếm nhiều không gian bàn làm việc. Kết nối nhanh, độ trễ thấp, rất phù hợp cho cả làm việc và chơi game.",
    tags: ["Thiết kế gọn", "Kết nối nhanh", "Phù hợp chơi game"],
  },
];

function RatingCard({ onComingSoon }) {
  return (
    <aside className="rating-card">
      <div className="small-label">ĐIỂM TRUNG BÌNH</div>
      <div className="rating-number">4.6</div>
      <p className="rating-caption">Dựa trên 128 đánh giá</p>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <IconStar key={n} size={18} />
        ))}
      </div>
      <div className="rating-breakdown">
        {[92, 24, 8, 3, 1].map((count, index) => (
          <div key={count} className="breakdown-row">
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

function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-top">
        <div>
          <strong>{review.name}</strong>
          <p>Đã mua THREAD 75 · {review.date}</p>
        </div>
        <span className="review-score">
          <IconStar size={16} /> {review.rating}
        </span>
      </div>
      <p className="review-text">{review.text}</p>
      <div className="review-tags">
        {review.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}

export default function ReviewsSection({ onComingSoon }) {
  const reviewsRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Tiêu đề & giới thiệu reviews
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

        // Cột điểm trung bình Rating Card
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

        // Điểm số 4.6 nảy pop
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

        // Các dòng phân bổ đánh giá (breakdown)
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

        // Danh sách thẻ nhận xét Review Cards xuất hiện so le
        gsap.from(".review-card", {
          autoAlpha: 0,
          y: 45,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".review-list",
            start: "top 85%",
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
        <RatingCard onComingSoon={onComingSoon} />
        <div className="review-list">
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
