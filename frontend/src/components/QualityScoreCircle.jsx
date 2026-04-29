export default function QualityScoreCircle({ score }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score > 80 ? "#16a34a" : score >= 50 ? "#ca8a04" : "#dc2626";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="110" height="110" className="-rotate-90">
          <circle
            cx="55"
            cy="55"
            r={radius}
            className="stroke-gray-200 dark:stroke-gray-800"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="55"
            cy="55"
            r={radius}
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Quality Score
      </span>
    </div>
  );
}
