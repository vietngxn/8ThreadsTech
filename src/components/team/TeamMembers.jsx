const members = [
  { name: "Nguyễn Hữu Tiến", detail: "23689901", image: "/assets/team-member-01.png", imageAlt: "Nguyễn Hữu Tiến bên bờ biển" },
  { name: "Quách Ngọc Long", detail: "Thành viên 8Threads", image: "/assets/team-member-02.png", imageAlt: "Quách Ngọc Long bên hồ" },
  { name: "Nguyễn Tiến Đạt", detail: "Thành viên 8Threads", image: null, imageAlt: "" },
  { name: "Nguyễn Hữu Nhân", detail: "236xxxxx", image: "/assets/team-member-04.png", imageAlt: "Nguyễn Hữu Nhân trên phố" },
  { name: "Nguyễn Bá Việt", detail: "23687551", image: "/assets/team-member-05.png", imageAlt: "Nguyễn Bá Việt trong thành phố" },
  { name: "Cao Quốc Trung", detail: "23666911", image: "/assets/team-member-06.png", imageAlt: "Cao Quốc Trung ngoài trời" },
  { name: "Hoàng Trí Minh Tâm", detail: "Thành viên 8Threads", image: "/assets/team-member-07.png", imageAlt: "Hoàng Trí Minh Tâm" },
  { name: "Nguyễn Hoàng Sơn", detail: "Thành viên 8Threads", image: "/assets/team-member-08.png", imageAlt: "Nguyễn Hoàng Sơn" },
  { name: "Hồ Vạn Thương", detail: "Thành viên 8Threads", image: null, imageAlt: "" },
];

export default function TeamMembers() {
  return (
    <section className="team-members" id="members" data-node-id="27:781">
      <div className="team-section-heading" data-node-id="27:782">
        <span className="team-eyebrow" data-node-id="27:784">01 / THÀNH VIÊN</span>
        <h2 data-node-id="27:785">Đội ngũ 8Threads</h2>
      </div>
      <div className="team-member-grid">
        {members.map((member, index) => (
          <article className={`team-member team-member-${index + 1}`} key={member.name} data-node-id={["27:790", "27:801", "27:812", "27:824", "27:835", "27:846", "27:858", "27:869", "27:880"][index]}>
            <span className="team-member-number">Thành viên {String(index + 1).padStart(2, "0")}</span>
            {member.image && <img className="team-member-photo" src={member.image} alt={member.imageAlt} />}
            <div className="team-member-name">
              <h3>{member.name}</h3>
              <span aria-hidden="true">↗</span>
            </div>
            <span className="team-member-detail">{member.detail}</span>
            <p>Giới thiệu ngắn</p>
          </article>
        ))}
      </div>
    </section>
  );
}