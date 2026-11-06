import { useState } from "react";
import Navbar from "../components/common/Navbar";
import LoginStage from "../components/login/LoginStage";
import LoginForm from "../components/login/LoginForm";

export default function LoginPage() {
  const [notice, setNotice] = useState("");

  return (
    <div className="login-page" data-node-id="3:565">
      <Navbar />
      <main className="login-main" data-node-id="3:584">
        <LoginStage />
        <LoginForm notice={notice} onNotice={setNotice} />
      </main>
    </div>
  );
}
