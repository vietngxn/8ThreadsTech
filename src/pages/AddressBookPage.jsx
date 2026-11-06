import { useState } from "react";
import { IconArrowUpRight, IconBuilding, IconCheck, IconChevronRight, IconCircleCheck, IconHome, IconLock, IconLogout, IconMapPin, IconPackage, IconPencil, IconPlus, IconSearch, IconShoppingBag, IconTrash, IconUser, IconX } from "@tabler/icons-react";
import logo from "../assets/thread-logo.png";
import CartHeader from "../components/cart/CartHeader";
import CartFooter from "../components/cart/CartFooter";
import AddressSidebar from "../components/address/AddressSidebar";
import AddressPanel from "../components/address/AddressPanel";
import AddressForm from "../components/address/AddressForm";
import AddressConfirmDelete from "../components/address/AddressConfirmDelete";

const initialAddresses = [
  {
    id: "home",
    label: "Nhà riêng",
    recipient: "Nguyễn Minh An",
    phone: "0987 654 123",
    address: "123 Đường Số 8, Phường Thủ Đức, TP. Hồ Chí Minh",
    isDefault: true,
  },
  {
    id: "office",
    label: "Văn phòng",
    recipient: "Nguyễn Minh An",
    phone: "0987 654 123",
    address: "Tầng 5, 72 Nguyễn Cơ Thạch, Phường An Khánh, TP. Hồ Chí Minh",
    isDefault: false,
  },
];

const emptyForm = { label: "Nhà riêng", recipient: "", phone: "", address: "", isDefault: false };

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState(null);

  const saveAddress = (values) => {
    const id = values.id ?? `address-${Date.now()}`;
    setAddresses((current) => {
      const next = current.map((address) => ({
        ...address,
        isDefault: address.id === id || values.isDefault ? false : address.isDefault,
      }));
      const savedAddress = { ...values, id, isDefault: values.isDefault || !next.some((address) => address.isDefault) };
      const existingIndex = next.findIndex((address) => address.id === id);
      if (existingIndex >= 0) next[existingIndex] = savedAddress;
      else next.push(savedAddress);
      return next;
    });
    setEditingAddress(null);
    setIsAdding(false);
  };

  const setDefault = (id) => setAddresses((current) => current.map((address) => ({ ...address, isDefault: address.id === id })));

  const deleteAddress = () => {
    setAddresses((current) => {
      const remaining = current.filter((address) => address.id !== deletingAddress.id);
      if (deletingAddress.isDefault && remaining.length) remaining[0] = { ...remaining[0], isDefault: true };
      return remaining;
    });
    setDeletingAddress(null);
  };

  return (
    <div className="address-page" data-node-id="20:3">
      <CartHeader quantity={0} />
      
      <main>
        <section className="address-intro" data-node-id="20:22">
          <div className="cart-breadcrumb" data-node-id="20:23">
            <a href="/">Trang chủ</a>
            <IconChevronRight />
            <a href="/ho-so">Tài khoản</a>
            <IconChevronRight />
            <span>Sổ địa chỉ</span>
          </div>
          <div className="address-title-wrap" data-node-id="20:29">
            <div className="address-title">
              <div className="address-signature" data-node-id="20:30">
                <i data-node-id="20:31" />
                <span data-node-id="20:32">8THREADS - "FEEL" THEO TỪNG NHỊP GÕ CỦA BẠN.</span>
              </div>
              <h1 data-node-id="20:33">SỔ ĐỊA CHỈ</h1>
            </div>
          </div>
          <div className="address-intro-divider" data-node-id="20:34" />
        </section>

        <section className="address-content" data-node-id="20:35">
          <AddressSidebar />
          <AddressPanel
            addresses={addresses}
            onAdd={setIsAdding}
            onEdit={setEditingAddress}
            onDefault={setDefault}
            onDelete={setDeletingAddress}
          />
        </section>
      </main>
      
      <CartFooter />
      
      {(isAdding || editingAddress) && (
        <AddressForm
          key={editingAddress?.id ?? "new-address"}
          address={editingAddress}
          onClose={() => { setIsAdding(false); setEditingAddress(null); }}
          onSave={saveAddress}
        />
      )}
      {deletingAddress && <AddressConfirmDelete address={deletingAddress} onClose={() => setDeletingAddress(null)} onConfirm={deleteAddress} />}
    </div>
  );
}