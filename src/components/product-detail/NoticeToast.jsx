import { IconX } from "@tabler/icons-react";

export default function NoticeToast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="thread-notice" role="status">
      {message}
      <button onClick={onClose} aria-label="Đóng">
        <IconX size={16} />
      </button>
    </div>
  );
}

