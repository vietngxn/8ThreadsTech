import { Outlet } from "react-router-dom";
import ChatBot from "../components/common/ChatBot.jsx";

/**
 * Layout cửa hàng: giới hạn max-width để không bị giãn khi zoom.
 * Hỗ trợ cả {children} và <Outlet /> của React Router.
 */
export function Layout({ children }) {
  return (
    <div className="page-wrapper">
      <div className="page-container">
        {children || <Outlet />}
      </div>
      <ChatBot />
    </div>
  );
}
