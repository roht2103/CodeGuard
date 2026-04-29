import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import StatsCard from "../components/StatsCard.jsx";
import TrendChart from "../components/TrendChart.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsResponse, scansResponse] = await Promise.all([
          api.get("/api/dashboard/stats"),
          api.get("/api/scans")
        ]);
        setStats(statsResponse.data);
        setScans(scansResponse.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const scoreColor = (score) => {
    if (score > 80) return "text-neon";
    if (score >= 50) return "text-yellow-300";
    return "text-ember";
  };

  return (
    <div className="px-6 pb-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Quality Dashboard</h1>
            <p className="text-sm text-mist/70">Track every scan, trend, and vulnerability.</p>
          </div>
          <Link
            to="/new-scan"
            className="rounded-full bg-neon text-ink px-5 py-2 font-semibold hover:bg-neon/90"
          >
            New Scan
          </Link>
        </div>

        {loading ? (
          <div className="bg-panel rounded-2xl p-10 text-center">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard label="Total Scans" value={stats?.totalScans ?? 0} />
              <StatsCard label="Total Vulnerabilities" value={stats?.totalVulnerabilities ?? 0} />
              <StatsCard label="Average Quality" value={stats?.averageQualityScore ?? 0} />
              <StatsCard label="Critical Issues" value={stats?.criticalTotal ?? 0} />
            </div>

            <div className="bg-panel rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Quality Trend</h2>
                <span className="text-xs text-mist/60">Last 10 scans</span>
              </div>
              <TrendChart data={stats?.qualityTrend || []} />
            </div>

            <div className="bg-panel rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Scans</h2>
                <span className="text-xs text-mist/60">{scans.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-mist/60">
                      <th className="py-2">File</th>
                      <th className="py-2">Language</th>
                      <th className="py-2">Score</th>
                      <th className="py-2">Issues</th>
                      <th className="py-2">Date</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {scans.map((scan) => (
                      <tr key={scan.id} className="border-t border-tide/10">
                        <td className="py-3">{scan.fileName}</td>
                        <td className="py-3">{scan.language}</td>
                        <td className={`py-3 font-semibold ${scoreColor(scan.qualityScore)}`}>
                          {scan.qualityScore}
                        </td>
                        <td className="py-3">{scan.totalVulnerabilities}</td>
                        <td className="py-3">
                          {new Date(scan.scannedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/scans/${scan.id}`}
                            className="text-tide hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {scans.length === 0 && (
                  <p className="text-center text-mist/60 py-6">No scans yet.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
