import { Card } from "./Card.jsx";

export default function StatsCard({ label, value }) {
  return (
    <Card className="p-5 flex flex-col justify-center">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {value}
      </p>
    </Card>
  );
}
