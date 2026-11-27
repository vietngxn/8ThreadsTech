import { useState } from "react";
import Navbar from "../components/common/Navbar";
import LoginStage from "../components/login/LoginStage";
import ForgotPasswordForm from "../components/login/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const [notice, setNotice] = useState("");

  return (
    <div className="login-page otp-page">
      <Navbar />
      <main className="login-main otp-main">
        <LoginStage />
        <ForgotPasswordForm notice={notice} onNotice={setNotice} />
      </main>
    </div>
  );
}
