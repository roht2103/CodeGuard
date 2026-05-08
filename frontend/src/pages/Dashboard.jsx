import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { LayoutDashboard, FileCode2, Settings as SettingsIcon, LogOut, History } from "lucide-react";
import api from "../api/axios.js";
import StatsCard from "../components/StatsCard.jsx";
import TrendChart from "../components/TrendChart.jsx";
import { Card } from "../components/Card.jsx";
import { Button } from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [scans, setScans] = useState([]);
  const [repoScans, setRepoScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('none');
  const { logout } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsResponse, scansResponse, repoScansResponse] = await Promise.all([
          api.get("/api/dashboard/stats"),
          api.get("/api/scans"),
          api.get("/api/repos/scans")
        ]);
        setStats(statsResponse.data);
        setScans(scansResponse.data);
        setRepoScans(repoScansResponse.data);
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
    if (score > 80) return "text-green-600 dark:text-[#10b981]";
    if (score >= 50) return "text-yellow-600 dark:text-[#f59e0b]";
    return "text-red-600 dark:text-[#ef4444]";
  };

  const getBadgeClass = (score) => {
    if (score > 80) return "bg-green-50 text-green-700 border-green-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
    if (score >= 50) return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
    return "bg-red-50 text-red-700 border-red-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
  };

  const combinedScans = useMemo(() => {
    const combined = [
      ...scans.map(s => ({ ...s, scanType: 'file', timestamp: new Date(s.scannedAt).getTime() })),
      ...repoScans.map(r => ({ ...r, scanType: 'repo', timestamp: new Date(r.scannedAt).getTime() }))
    ];
    
    if (sortType === 'asc') {
      combined.sort((a, b) => a.scanType.localeCompare(b.scanType));
    } else if (sortType === 'desc') {
      combined.sort((a, b) => b.scanType.localeCompare(a.scanType));
    } else {
      combined.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    return combined.slice(0, 10);
  }, [scans, repoScans, sortType]);

  const handleSortClick = () => {
    setSortType(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none');
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0B1120]">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#0B1120] hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16">
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1.5">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white font-medium text-sm transition-colors">
              <LayoutDashboard size={18} />
              Overview
            </Link>
            <Link to="/repo-quality" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5 font-medium text-sm transition-colors">
              <FileCode2 size={18} />
              Repo Scan
            </Link>
            <Link to="/new-scan" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5 font-medium text-sm transition-colors">
              <FileCode2 size={18} />
              Code Smell Analyzer
            </Link>
            <Link to="/history" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5 font-medium text-sm transition-colors">
              <History size={18} />
              History
            </Link>
            <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5 font-medium text-sm transition-colors opacity-50 cursor-not-allowed">
              <SettingsIcon size={18} />
              Settings
            </Link>
          </nav>

          {/* <div className="mt-8">
            <Link to="/new-scan">
              <Button className="w-full justify-center">
                + New Repo Scan
              </Button>
            </Link>
          </div> */}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-indigo-900/50 flex items-center justify-center text-blue-700 dark:text-indigo-400 font-bold text-sm">
              U
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">User Account</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 truncate">Pro Plan</div>
            </div>
          </div>
          <button onClick={logout} className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Overview
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage analyses and repository reports from one place.
              </p>
            </div>
            <div className="md:hidden">
              <Link to="/new-scan">
                <Button>New Analysis</Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <Card className="p-12 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-pulse">Loading dashboard data...</div>
            </Card>
          ) : (
            <>
              {/* Stat Cards - SpaceFit Style */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Avg. Quality</div>
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                    {stats?.averageQualityScore || 0}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">Across completed scans</div>
                </Card>
                <Card className="p-6">
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Total Scans</div>
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                    {stats?.totalScans || 0}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">Total processed</div>
                </Card>
                <Card className="p-6">
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Critical Issues</div>
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                    {stats?.criticalTotal || 0}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">Requires immediate fix</div>
                </Card>
                <Card className="p-6 flex flex-col justify-between">
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Score Trend</div>
                  <TrendChart data={stats?.qualityTrend || []} />
                </Card>
              </div>

              {/* Recent Analyses Table */}
              <Card className="overflow-hidden p-0 border-gray-200 dark:border-white/10 mb-8">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                    Recent Analyses
                  </h2>
                  <Link to="/history" className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    View all
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400/70 bg-gray-50/50 dark:bg-transparent">
                        <th 
                          className="px-6 py-4 font-bold text-xs uppercase tracking-widest cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group select-none"
                          onClick={handleSortClick}
                        >
                          Type <span className="inline-block ml-1 opacity-50 group-hover:opacity-100">{sortType === 'asc' ? '↑' : sortType === 'desc' ? '↓' : '↕'}</span>
                        </th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Target</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {combinedScans.map((scan) => (
                        <tr key={`${scan.scanType}-${scan.id}`} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-200">
                              {scan.scanType === 'file' ? 'File Scan' : 'Repo Scan'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {scan.scanType === 'file' ? scan.fileName : `${scan.owner}/${scan.repo}`}
                            </div>
                            {scan.scanType === 'repo' && <div className="text-xs text-gray-500">{scan.branch || "default branch"}</div>}
                            {scan.scanType === 'file' && <div className="text-xs text-gray-500">{scan.language}</div>}
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                            {new Date(scan.scannedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getBadgeClass(scan.qualityScore || scan.avgScore)}`}>
                              {scan.qualityScore || scan.avgScore}% {(scan.qualityScore || scan.avgScore) >= 80 ? 'Fit' : 'Partial Fit'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Link
                              to={scan.scanType === 'file' ? `/scans/${scan.id}` : `/repo-scans/${scan.id}`}
                              className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-transparent dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
                            >
                              Report
                            </Link>
                            <button className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 hover:text-red-700 bg-white border border-gray-200 hover:bg-red-50 dark:bg-transparent dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {combinedScans.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No analyses yet.</p>
                      <Link to="/new-scan">
                        <Button variant="secondary">Start your first scan</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
