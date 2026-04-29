import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function TrendChart({ data }) {
  // Use generic colors that look okay on both or just simple gray
  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            domain={[0, 100]} 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
            itemStyle={{ color: "#111827" }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
