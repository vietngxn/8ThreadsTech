import { useState } from "react";
import LoginHeader from "../components/login/LoginHeader";
import LoginStage from "../components/login/LoginStage";
import LoginForm from "../components/login/LoginForm";

export default function LoginPage() {
  const [notice, setNotice] = useState("");

  return (
    <div className="login-page" data-node-id="3:565">
      <LoginHeader />
      <main className="login-main" data-node-id="3:584">
        <LoginStage />
        <LoginForm notice={notice} onNotice={setNotice} />
      </main>
    </div>
  );
}
