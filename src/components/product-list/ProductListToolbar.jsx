import { IconSearch, IconChevronDown } from "@tabler/icons-react";

export default function ProductListToolbar({ query, sort, visibleCount, onQueryChange, onSortChange }) {
  return (
    <div className="pl-toolbar" data-node-id="3:843">
      <p data-node-id="3:844">
        {visibleCount ? `Hiển thị 1–${visibleCount} trong 24 sản phẩm` : "Không tìm thấy sản phẩm phù hợp"}
      </p>
      <div className="pl-controls" data-node-id="3:845">
        <label className="pl-search" htmlFor="product-search">
          <IconSearch size={15} data-node-id="3:847" />
          <input 
            id="product-search" 
            value={query} 
            onChange={(event) => onQueryChange(event.target.value)} 
            placeholder="Tìm bàn phím của bạn..." 
          />
        </label>
        <label className="pl-sort" htmlFor="product-sort">
          <span className="sr-only">Sắp xếp sản phẩm</span>
          <select 
            id="product-sort"
            value={sort} 
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="featured">Sắp xếp: Bán chạy nhất</option>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
          </select>
          <IconChevronDown size={14} data-node-id="3:852" />
        </label>
      </div>
    </div>
  );
}
