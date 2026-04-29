const styles = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  LOW: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
};

export default function SeverityBadge({ severity }) {
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${styles[severity] || ""}`}
    >
      {severity}
    </span>
  );
}
