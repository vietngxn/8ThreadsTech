export default function ProductListEmpty({ onReset }) {
  return (
    <div className="pl-empty">
      <span>Không có sản phẩm nào phù hợp với lựa chọn của bạn.</span>
      <button onClick={onReset}>Xóa bộ lọc</button>
    </div>
  );
}
