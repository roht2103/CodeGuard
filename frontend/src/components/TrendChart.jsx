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
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1b4965" />
          <XAxis dataKey="date" stroke="#a6b8cc" />
          <YAxis domain={[0, 100]} stroke="#a6b8cc" />
          <Tooltip
            contentStyle={{
              background: "#0f1b2d",
              border: "1px solid #1b4965",
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#5fa8d3"
            strokeWidth={3}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
