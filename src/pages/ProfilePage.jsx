import { useState } from "react";
import CartHeader from "../components/cart/CartHeader";
import CartFooter from "../components/cart/CartFooter";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileForm from "../components/profile/ProfileForm";
import ProfileSupporting from "../components/profile/ProfileSupporting";
import thread75 from "../assets/list-thread-75.png";

const initialProfile = {
  name: "Nguyễn Minh An",
  email: "minhan@example.com",
  phone: "0987 654 123",
  birthday: "15 / 08 / 1998",
  gender: "Nam",
  newsletter: true,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [saved, setSaved] = useState(false);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setProfile((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setSaved(false);
  };

  const resetProfile = () => {
    setProfile(initialProfile);
    setSaved(false);
  };

  return (
    <div className="profile-page" data-node-id="8:811">
      <CartHeader quantity={0} />
      
      <main>
        <section className="profile-intro" data-node-id="8:830">
          <div className="cart-breadcrumb" data-node-id="8:831">
            <a href="/">Trang chủ</a>
            <IconChevronRight />
            <a href="/ho-so">Tài khoản</a>
            <IconChevronRight />
            <span>Hồ sơ cá nhân</span>
          </div>
          <div className="profile-title-wrap" data-node-id="8:837">
            <div className="profile-title" data-node-id="8:838">
              <div className="profile-signature" data-node-id="8:839">
                <i data-node-id="8:840" />
                <span data-node-id="8:841">8THREADS - "FEEL" THEO TỪNG NHỊP GÕ CỦA BẠN.</span>
              </div>
              <h1 data-node-id="8:842">HỒ SƠ</h1>
            </div>
          </div>
          <div className="profile-intro-divider" data-node-id="8:846" />
        </section>

        <section className="profile-content" data-node-id="8:847">
          <ProfileSidebar currentPage="profile" />
          <ProfileForm
            profile={profile}
            onUpdate={update}
            onReset={resetProfile}
            saved={saved}
          />
          <ProfileSupporting profile={profile} />
        </section>
      </main>
      
      <CartFooter />
    </div>
  );
}