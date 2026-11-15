import { IconAdjustmentsHorizontal, IconMinus, IconArrowUpRight } from "@tabler/icons-react";
import { FILTER_GROUPS } from "../../constants/productFilters";

const filterGroups = FILTER_GROUPS;

export default function ProductListSidebar({ category, filters, inStockOnly, onCategoryChange, onFilterToggle, onStockToggle }) {
  return (
    <aside className="pl-sidebar" data-node-id="3:754">
      <div className="pl-filter-title" data-node-id="3:755">
        <IconAdjustmentsHorizontal size={17} data-node-id="3:756" />
        <span data-node-id="3:758">BỘ LỌC</span>
      </div>
      
      <section className="pl-filter-group pl-category-filter" data-node-id="3:759">
        <h2 data-node-id="3:760">DÒNG BÀN PHÍM</h2>
        {["Tất cả bàn phím", "Bàn phím cơ", "Bàn phím gaming", "Bàn phím low-profile"].map((item, index) => (
          <button 
            key={item} 
            className={category === item ? "selected" : ""} 
            onClick={() => onCategoryChange(item)}
          >
            <span>{item}</span>
            <small>{["24", "16", "5", "3"][index]}</small>
          </button>
        ))}
      </section>
      
      {filterGroups.map((group, groupIndex) => (
        <fieldset className="pl-filter-group" key={group.key} data-node-id={["3:773", "3:787", "3:804", "3:818"][groupIndex]}>
          <legend>
            <span>{group.title}</span>
            <IconMinus size={14} data-node-id={["3:776", "3:790", "3:807", "3:821"][groupIndex]} />
          </legend>
          {group.options.map((option) => (
            <label key={option} className="pl-check">
              <input 
                type="checkbox" 
                checked={filters.includes(option)} 
                onChange={() => onFilterToggle(option)} 
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
      ))}
      
      <label className="pl-stock" data-node-id="3:832">
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(event) => onStockToggle(event.target.checked)} 
        />
        <span>Chỉ hiển thị hàng có sẵn</span>
      </label>
      
      <div className="pl-help" data-node-id="3:835">
        <h2 data-node-id="3:836">CHƯA BIẾT CHỌN GÌ?</h2>
        <p data-node-id="3:837">Để 8Threads giúp bạn tìm chiếc bàn phím đúng gu, đúng nhu cầu.</p>
        <a href="mailto:hello@8threadtech.vn" data-node-id="3:838">
          TƯ VẤN CHỌN PHÍM <IconArrowUpRight size={15} data-node-id="3:840" />
        </a>
      </div>
    </aside>
  );
}
