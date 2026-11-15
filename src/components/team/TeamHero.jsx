import { IconArrowDown } from "@tabler/icons-react";
import infinity from "../../assets/team-infinity.svg";

export default function TeamHero() {
  return (
    <section className="team-hero" data-node-id="27:752">
      <div className="team-hero-title" data-node-id="27:766">
        <h1 data-node-id="27:767">8THREADS TEAM</h1>
        <div className="team-hero-subtitle" data-node-id="27:768">
          <span data-node-id="27:769">về chúng tôi</span>
          <i aria-hidden="true" data-node-id="27:770">✳</i>
        </div>
      </div>
      <div className="team-intro" data-node-id="27:771">
        <img className="team-infinity" src={infinity} alt="" data-node-id="27:773" />
        <div className="team-intro-copy" data-node-id="27:775">
          <p data-node-id="27:776">8Threads Team bao gồm 9 thành viên.<br />Dưới đây là thông tin chung về đội ngũ chúng tôi.</p>
          <a href="#members" data-node-id="27:777">
            Xem danh sách thành viên <IconArrowDown size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}