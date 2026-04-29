export default function StatsCard({ label, value }) {
  return (
    <div className="bg-panel rounded-2xl p-4 glow">
      <p className="text-xs uppercase tracking-widest text-mist/60">{label}</p>
      <p className="text-2xl font-semibold mt-2 text-mist">{value}</p>
    </div>
  );
}
