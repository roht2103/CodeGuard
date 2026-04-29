export default function QualityScoreCircle({ score }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score > 80 ? "#00a896" : score >= 50 ? "#f6c453" : "#ff6b35";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="110" height="110" className="-rotate-90">
        <circle
          cx="55"
          cy="55"
          r={radius}
          stroke="#1b4965"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="55"
          cy="55"
          r={radius}
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="text-2xl font-semibold" style={{ color }}>
        {score}
      </span>
      <span className="text-xs text-mist/70">Quality Score</span>
    </div>
  );
}
