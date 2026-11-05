import { IconRefresh, IconShieldCheck, IconTruck } from "@tabler/icons-react";

export default function PageFooter() {
  return (
    <footer className="thread-footer" data-node-id="3:1210">
      <strong>8THREADS / NHỊP GÕ CỦA BẠN.</strong>
      <div>
        <span><IconTruck size={17} />Miễn phí vận chuyển</span>
        <span><IconShieldCheck size={17} />Bảo hành 24 tháng</span>
        <span><IconRefresh size={17} />Đổi mới trong 7 ngày</span>
      </div>
    </footer>
  );
}

