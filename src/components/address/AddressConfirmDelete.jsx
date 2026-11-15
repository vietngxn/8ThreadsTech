import { IconArrowUpRight, IconTrash } from "@tabler/icons-react";

export default function AddressConfirmDelete({ address, onClose, onConfirm }) {
  return (
    <div className="address-modal-backdrop">
      <section className="address-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-address-title">
        <span className="address-confirm-icon"><IconTrash /></span>
        <h2 id="delete-address-title">XÓA ĐỊA CHỈ NÀY?</h2>
        <p>Địa chỉ giao hàng sẽ bị xóa khỏi sổ địa chỉ của bạn.</p>
        <div className="address-modal-actions">
          <button className="address-secondary-button" onClick={onClose}>GIỮ LẠI</button>
          <button className="address-primary-button" onClick={onConfirm}>XÓA ĐỊA CHỈ<IconTrash /></button>
        </div>
      </section>
    </div>
  );
}