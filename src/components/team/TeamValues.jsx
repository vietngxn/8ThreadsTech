import connections from "../../assets/team-connections.svg";

export default function TeamValues() {
  return (
    <section className="team-values" data-node-id="27:894">
      <span className="team-eyebrow">02 / VỀ 8THREADS</span>
      <div className="team-values-intro">
        <h2>8threads là một nhóm sinh viên đến từ khoa Kĩ thuật phần mềm IUH.</h2>
        <img src={connections} alt="Chín sợi chỉ cùng kết nối" data-node-id="27:900" />
      </div>
      <div className="team-values-grid">
        <article>
          <span>01</span>
          <h3>Thông tin chung</h3>
          <p>Tên nhóm, thành viên và các mục cần điền sẽ được cập nhật khi có dữ liệu thật.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Ngành nghề</h3>
          <p>Chưa có thông tin ngành nghề cụ thể cho nhóm.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Thành tích</h3>
          <p>Chưa có thành tích cụ thể để cập nhật.</p>
        </article>
      </div>
    </section>
  );
}