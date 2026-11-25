import { useState, useEffect } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import Navbar from "../components/common/Navbar";
import CartFooter from "../components/cart/CartFooter";
import AddressSidebar from "../components/address/AddressSidebar";
import AddressPanel from "../components/address/AddressPanel";
import AddressForm from "../components/address/AddressForm";
import AddressConfirmDelete from "../components/address/AddressConfirmDelete";
import { userService } from "../services/userService";

const CACHE_KEY = "cached_user_addresses";

function getCachedAddresses() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState(getCachedAddresses);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState(null);
  const [loading, setLoading] = useState(() => getCachedAddresses().length === 0);

  const fetchAddresses = async () => {
    try {
      const data = await userService.getMyAddresses();
      const mapped = data.map((item) => ({
        id: item.id,
        label: item.addressType || "Nhà riêng",
        recipient: item.receiverName,
        phone: item.receiverPhone,
        address: item.fullAddress || item.addressLine,
        isDefault: Boolean(item.isDefault),
      }));
      setAddresses(mapped);
      localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
      return mapped;
    } catch (err) {
      console.warn("Không thể tải sổ địa chỉ:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const saveAddress = async (values) => {
    const payload = {
      receiverName: values.recipient,
      addressType: values.label,
      receiverPhone: values.phone,
      addressLine: values.address,
      isDefault: values.isDefault,
    };

    setEditingAddress(null);
    setIsAdding(false);

    try {
      if (values.id) {
        await userService.updateAddress(values.id, payload);
      } else {
        await userService.createAddress(payload);
      }
      await fetchAddresses();
    } catch (err) {
      alert(err.message || "Không thể lưu địa chỉ");
      await fetchAddresses();
      throw err;
    }
  };

  const setDefault = async (id) => {
    // Cập nhật giao diện ngay tức thì (Optimistic UI)
    setAddresses((prev) => {
      const updated = prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })).sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      await userService.setDefaultAddress(id);
      fetchAddresses();
    } catch (err) {
      alert(err.message || "Không thể đặt làm địa chỉ mặc định");
      fetchAddresses();
    }
  };

  const deleteAddress = async () => {
    if (!deletingAddress?.id) return;
    const targetId = deletingAddress.id;

    // Đóng popup và xóa khỏi giao diện ngay lập tức (0ms)
    setDeletingAddress(null);
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== targetId);
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      await userService.deleteAddress(targetId);
      await fetchAddresses();
    } catch (err) {
      alert(err.message || "Không thể xóa địa chỉ");
      await fetchAddresses();
    }
  };

  return (
    <div className="address-page" data-node-id="20:3">
      <Navbar quantity={0} />
      
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
            loading={loading}
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
      {deletingAddress && (
        <AddressConfirmDelete
          address={deletingAddress}
          onClose={() => setDeletingAddress(null)}
          onConfirm={deleteAddress}
        />
      )}
    </div>
  );
}
