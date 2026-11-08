import { useState } from "react";
import Navbar from "../components/common/Navbar";
import LoginStage from "../components/login/LoginStage";
import OtpVerificationForm from "../components/login/OtpVerificationForm";

export default function OtpPage() {
  const [notice, setNotice] = useState("");

  return (
    <div className="login-page otp-page">
      <Navbar />
      <main className="login-main otp-main">
        <LoginStage />
        <OtpVerificationForm notice={notice} onNotice={setNotice} />
      </main>
    </div>
  );
}

