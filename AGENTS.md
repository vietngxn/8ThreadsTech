# Hướng dẫn dự án 8ThreadTech

Ứng dụng frontend độc lập dùng React 19, Vite và JavaScript JSX. Không sử dụng Agent-Native, React Router, backend hay luồng đăng nhập.

## Cấu trúc

- `src/assets/`: tài nguyên giao diện
- `src/pages/`: màn hình sản phẩm
- `src/layouts/`: bố cục dùng chung khi cần
- `src/components/`: thành phần giao diện dùng lại
- `src/hooks/`: React hooks dùng lại
- `src/services/`: tích hợp API nếu được yêu cầu
- `src/utils/`: hàm tiện ích dùng chung
- `src/App.jsx`: thành phần ứng dụng gốc
- `src/main.jsx`: entry point React
- `src/App.css`: stylesheet ứng dụng

## Lệnh

- `pnpm dev`: chạy Vite
- `pnpm build`: build frontend
- `pnpm preview`: xem bản build

Giữ giao diện và nội dung tiếng Việt hiện có. Không thêm backend, xác thực hoặc tích hợp bên ngoài nếu chưa được yêu cầu.
