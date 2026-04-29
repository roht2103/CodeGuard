import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import StatsCard from "../components/StatsCard.jsx";
import TrendChart from "../components/TrendChart.jsx";
import { Card } from "../components/Card.jsx";
import { Button } from "../components/Button.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsResponse, scansResponse] = await Promise.all([
          api.get("/api/dashboard/stats"),
          api.get("/api/scans"),
        ]);
        setStats(statsResponse.data);
        setScans(scansResponse.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const scoreColor = (score) => {
    if (score > 80) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Quality Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track every scan, trend, and vulnerability.
            </p>
          </div>
          <Link to="/new-scan">
            <Button variant="primary">New Scan</Button>
          </Link>
        </div>

        {loading ? (
          <Card className="p-12 text-center text-gray-500 dark:text-gray-400">
            <div className="animate-pulse">Loading dashboard...</div>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard label="Total Scans" value={stats?.totalScans ?? 0} />
              <StatsCard
                label="Total Vulnerabilities"
                value={stats?.totalVulnerabilities ?? 0}
              />
              <StatsCard
                label="Average Quality"
                value={stats?.averageQualityScore ?? 0}
              />
              <StatsCard
                label="Critical Issues"
                value={stats?.criticalTotal ?? 0}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Quality Trend
                  </h2>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                    Last 10 scans
                  </span>
                </div>
                <TrendChart data={stats?.qualityTrend || []} />
              </Card>

              <Card className="lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Scans
                  </h2>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {scans.length} total
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                        <th className="py-3 font-medium">File</th>
                        <th className="py-3 font-medium text-right">Score</th>
                        <th className="py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {scans.slice(0, 5).map((scan) => (
                        <tr key={scan.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                              {scan.fileName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {new Date(scan.scannedAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td
                            className={`py-3 text-right font-semibold ${scoreColor(scan.qualityScore)}`}
                          >
                            {scan.qualityScore}
                          </td>
                          <td className="py-3 text-right pl-4">
                            <Link
                              to={`/scans/${scan.id}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-indigo-400 dark:hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {scans.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No scans yet.
                    </p>
                  )}
                  {scans.length > 5 && (
                    <div className="mt-4 text-center">
                      <Link to="/repo-quality" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                        View all
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
