
import {
  IconArrowRight,
  IconChevronLeft,
} from "@tabler/icons-react";

export default function ProductListPagination({
  pageInfo,
  onPageChange,
}) {
  if (!pageInfo) return null;

  const currentPage = pageInfo.pageNumber ?? 0;
  const pageSize = pageInfo.pageSize ?? 9;
  const totalPages = pageInfo.totalPages ?? 0;
  const totalElements = pageInfo.totalElements ?? 0;

  const start = totalElements === 0
    ? 0
    : currentPage * pageSize + 1;

  const end = Math.min(
    (currentPage + 1) * pageSize,
    totalElements
  );

  if (totalPages <= 1) {
    return (
      <div className="pl-pagination">
        <p>
          Bạn đang xem {start} - {end} / {totalElements} sản phẩm
        </p>
      </div>
    );
  }

  return (
    <div className="pl-pagination">
      <p>
        Bạn đang xem {start} - {end} / {totalElements} sản phẩm
      </p>

      <div>
        <button
          aria-label="Trang trước"
          disabled={currentPage <= 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <IconChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index ? "current" : ""}
            aria-current={
              currentPage === index ? "page" : undefined
            }
            onClick={() => onPageChange(index)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="next"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Trang sau <IconArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
