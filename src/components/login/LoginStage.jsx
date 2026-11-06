import keyboard from "../../assets/login-keyboard.png";
import keycap from "../../assets/login-keycap.png";
import switchImage from "../../assets/login-switch.png";
import orbit from "../../assets/login-orbit.svg";

export default function LoginStage() {
  return (
    <section className="login-stage" aria-label="Chạm phím, bật chất riêng" data-node-id="3:585">
      <h1 data-node-id="3:592">
        CHẠM PHÍM<br />BẬT CHẤT RIÊNG
      </h1>
      <div className="login-art" aria-hidden="true">
        <img className="login-art-orbit" src={orbit} alt="" data-node-id="3:590" />
        <img className="login-art-keyboard" src={keyboard} alt="" data-node-id="3:588" />
        <img className="login-art-keycap" src={keycap} alt="" data-node-id="3:587" />
        <img className="login-art-switch" src={switchImage} alt="" data-node-id="3:586" />
        <span className="login-art-glow" data-node-id="3:591" />
      </div>
    </section>
  );
}
