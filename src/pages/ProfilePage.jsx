import { useState, useEffect } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import Navbar from "../components/common/Navbar";
import CartFooter from "../components/cart/CartFooter";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileForm from "../components/profile/ProfileForm";
import ProfileSupporting from "../components/profile/ProfileSupporting";
import NoticeToast from "../components/product-detail/NoticeToast";
import { userService } from "../services/userService";
import { authService } from "../services/authService";

const initialProfile = {
  name: "Nguyễn Minh An",
  email: "minhan@example.com",
  phone: "0987 654 123",
  birthday: "1998-08-15",
  gender: "Nam",
  newsletter: true,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const token = authService.getToken();
    if (!token) return;

    userService.getMyProfile()
      .then((data) => {
        if (!data) return;
        const mapped = {
          name: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          birthday: data.dateOfBirth ? String(data.dateOfBirth) : "",
          gender: data.gender || "Nam",
          newsletter: Boolean(data.receiveNewsletter),
          defaultAddress: data.defaultAddress,
          latestOrder: data.latestOrder,
        };
        setProfile(mapped);
        setOriginalProfile(mapped);
      })
      .catch((err) => {
        console.warn("Không thể tải thông tin cá nhân:", err);
      });
  }, []);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setProfile((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setSaved(false);
  };

  const resetProfile = () => {
    setProfile(originalProfile);
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        fullName: profile.name,
        phone: profile.phone,
        gender: profile.gender,
        receiveNewsletter: profile.newsletter,
      };
      if (profile.birthday && /^\d{4}-\d{2}-\d{2}$/.test(profile.birthday.trim())) {
        payload.dateOfBirth = profile.birthday.trim();
      }

      await userService.updateProfile(payload);
      setSaved(true);
      setOriginalProfile(profile);
      setNotice("Cập nhật thông tin cá nhân thành công!");
    } catch (err) {
      setNotice(err.message || "Lỗi khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page" data-node-id="8:811">
      <Navbar quantity={0} />
      
      <main>
        <section className="profile-intro" data-node-id="8:830">
          <div className="cart-breadcrumb" data-node-id="8:831">
            <a href="/">Trang chủ</a>
            <IconChevronRight />
            <a href="/ho-so">Tài khoản</a>
            <IconChevronRight />
            <span>Hồ sơ cá nhân</span>
          </div>
            <div className="profile-title" data-node-id="8:838">
              <div className="profile-signature" data-node-id="8:839">
                <i data-node-id="8:840" />
                <span data-node-id="8:841">8THREADS - "FEEL" THEO TỪNG NHỊP GÕ CỦA BẠN.</span>
              </div>
              <h1 data-node-id="8:842">HỒ SƠ</h1>
            </div>
          <div className="profile-intro-divider" data-node-id="8:846" />
        </section>

        <section className="profile-content" data-node-id="8:847">
          <ProfileSidebar currentPage="profile" />
          <ProfileForm
            profile={profile}
            onUpdate={update}
            onReset={resetProfile}
            onSave={handleSave}
            saved={saved}
            loading={loading}
          />
          <ProfileSupporting profile={profile} />
        </section>
      </main>
      
      <CartFooter />
      <NoticeToast message={notice} onClose={() => setNotice("")} />
    </div>
  );
}