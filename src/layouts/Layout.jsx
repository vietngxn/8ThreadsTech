/**
 * Layout đơn giản, không dùng Agent Native.
 * Bao toàn bộ trang trong một container giới hạn max-width
 * để nội dung không bị giãn khi zoom in/out.
 */
export function Layout({ children }) {
  return (
    <div className="page-wrapper">
      <div className="page-container">
        {children}
      </div>
    </div>
  );
}
