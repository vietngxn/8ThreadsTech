import { IconArrowRight, IconChevronLeft } from "@tabler/icons-react";

/**
 * Trả về danh sách phần tử để hiển thị, ví dụ (trang hiện tại = 7, tổng 20):
 *   1 … 6 7 8 … 20
 * Số là chỉ số trang (bắt đầu từ 0), chuỗi là dấu "…".
 */
function getPageItems(current, total) {
  const wanted = new Set([0, total - 1, current - 1, current, current + 1]);
  const pages = [...wanted]
    .filter((p) => p >= 0 && p < total)
    .sort((a, b) => a - b);

  const items = [];

  pages.forEach((page, i) => {
    if (i > 0) {
      const gap = page - pages[i - 1];
      // Chỉ thiếu đúng 1 trang thì hiện luôn số đó, không cần dấu "…"
      if (gap === 2) items.push(pages[i - 1] + 1);
      else if (gap > 2) items.push(`gap-${i}`);
    }
    items.push(page);
  });

  return items;
}

export default function ProductListPagination({ pageInfo, onPageChange }) {
  if (!pageInfo) return null;

  const currentPage = pageInfo.pageNumber ?? 0;
  const pageSize = pageInfo.pageSize ?? 9;
  const totalPages = pageInfo.totalPages ?? 0;
  const totalElements = pageInfo.totalElements ?? 0;

  const start = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalElements);

  const summary = (
    <p>
      Bạn đang xem {start} - {end} / {totalElements} sản phẩm
    </p>
  );

  if (totalPages <= 1) {
    return <div className="pl-pagination">{summary}</div>;
  }

  const items = getPageItems(currentPage, totalPages);

  return (
    <div className="pl-pagination">
      {summary}

      <div>
        <button
          aria-label="Trang trước"
          disabled={currentPage <= 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <IconChevronLeft size={16} />
        </button>

        {items.map((item) =>
          typeof item === "string" ? (
            <span
              key={item}
              aria-hidden="true"
              style={{ padding: "0 6px", userSelect: "none" }}
            >
              …
            </span>
          ) : (
            <button
              key={item}
              className={currentPage === item ? "current" : ""}
              aria-label={`Trang ${item + 1}`}
              aria-current={currentPage === item ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {item + 1}
            </button>
          )
        )}

        <button
          className="next"
          aria-label="Trang sau"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Trang sau <IconArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
