const styles = {
  CRITICAL: "bg-red-500/20 text-red-200 border-red-400/40",
  HIGH: "bg-orange-500/20 text-orange-200 border-orange-400/40",
  MEDIUM: "bg-yellow-500/20 text-yellow-100 border-yellow-400/40",
  LOW: "bg-blue-500/20 text-blue-200 border-blue-400/40",
};

export default function SeverityBadge({ severity }) {
  return (
    <span
      className={`px-3 py-1 text-xs rounded-full border ${styles[severity] || ""}`}
    >
      {severity}
    </span>
  );
}
