import { IconArrowRight, IconChevronLeft } from "@tabler/icons-react";

export default function ProductListPagination({ visibleCount }) {
  return (
    <div className="pl-pagination" data-node-id="3:1057">
      <p>Bạn đang xem {visibleCount ? `${visibleCount} / 24` : "0 / 24"} sản phẩm</p>
      <div>
        <button aria-label="Trang trước" disabled>
          <IconChevronLeft size={16} />
        </button>
        <button className="current" aria-current="page">1</button>
        <button disabled>2</button>
        <button disabled>3</button>
        <button className="next" disabled>
          Trang sau <IconArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
