import { useStatsAnimation } from '../../hooks/useStatsAnimation';

const statsData = [
  ["75%", "LAYOUT CÂN BẰNG"],
  ["CNC", "KHUNG NHÔM"],
  ["3 chế độ", "KẾT NỐI LINH HOẠT"],
  ["1.000 Hz", "TẦN SỐ PHẢN HỒI"]
];

export default function StatsSection() {
  const statsRef = useStatsAnimation();

  return (
    <div ref={statsRef} className="landing-stats" data-node-id="36:5134">
      <p>NHỎ GỌN TRONG DÁNG.<br />KHÁC BIỆT TRONG CHẤT.</p>
      {statsData.map(([value, label]) => (
        <div key={value}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
