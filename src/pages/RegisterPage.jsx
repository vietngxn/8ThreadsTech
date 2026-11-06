import { useState } from "react";
import LoginHeader from "../components/login/LoginHeader";
import LoginStage from "../components/login/LoginStage";
import RegisterForm from "../components/login/RegisterForm";

export default function RegisterPage() {
  const [notice, setNotice] = useState("");

  return (
    <div className="login-page register-page" data-node-id="3:633">
      <LoginHeader />
      <main className="login-main register-main" data-node-id="3:652">
        <LoginStage />
        <RegisterForm notice={notice} onNotice={setNotice} />
      </main>
    </div>
  );
}
