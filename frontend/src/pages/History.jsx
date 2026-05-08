import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { Card } from "../components/Card.jsx";
import { Button } from "../components/Button.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function History() {
  const [scans, setScans] = useState([]);
  const [repoScans, setRepoScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'file', 'repo'
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [scansResponse, repoScansResponse] = await Promise.all([
          api.get("/api/scans"),
          api.get("/api/repos/scans"),
        ]);
        setScans(scansResponse.data);
        setRepoScans(repoScansResponse.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load history.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getBadgeClass = (score) => {
    if (score > 80) return "bg-green-50 text-green-700 border-green-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
    if (score >= 50) return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
    return "bg-red-50 text-red-700 border-red-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, type: scanType } = deleteTarget;
    try {
      if (scanType === 'file') {
        await api.delete(`/api/scans/${id}`);
        setScans(prev => prev.filter(scan => scan.id !== id));
      } else {
        await api.delete(`/api/repos/scans/${id}`);
        setRepoScans(prev => prev.filter(scan => scan.id !== id));
      }
      toast.success("Analysis deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete analysis.");
    }
  };

  const combinedHistory = [
    ...scans.map(s => ({ ...s, type: 'file', timestamp: new Date(s.scannedAt).getTime() })),
    ...repoScans.map(r => ({ ...r, type: 'repo', timestamp: new Date(r.scannedAt).getTime() }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  const filteredHistory = combinedHistory.filter(item => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Analysis History
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              View all your past file scans and repository analyses.
            </p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/5"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("repo")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "repo" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/5"}`}
            >
              Repo Scans
            </button>
            <button 
              onClick={() => setFilter("file")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "file" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/5"}`}
            >
              File Scans
            </button>
          </div>
        </div>

        {loading ? (
          <Card className="p-12 text-center text-gray-500 dark:text-gray-400">
            <div className="animate-pulse">Loading history...</div>
          </Card>
        ) : (
          <Card className="overflow-hidden p-0 border-gray-200 dark:border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400/70 bg-gray-50/50 dark:bg-transparent">
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Target</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredHistory.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-200">
                          {item.type === 'file' ? 'File Scan' : 'Repo Scan'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {item.type === 'file' ? item.fileName : `${item.owner}/${item.repo}`}
                        </div>
                        {item.type === 'repo' && <div className="text-xs text-gray-500">{item.branch || "default branch"}</div>}
                        {item.type === 'file' && <div className="text-xs text-gray-500">{item.language}</div>}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {new Date(item.scannedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getBadgeClass(item.qualityScore || item.avgScore)}`}>
                          {item.qualityScore || item.avgScore}% {(item.qualityScore || item.avgScore) >= 80 ? 'Fit' : 'Partial Fit'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          to={item.type === 'file' ? `/scans/${item.id}` : `/repo-scans/${item.id}`}
                          className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-transparent dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
                        >
                          Report
                        </Link>
                        <button 
                          onClick={() => setDeleteTarget({ id: item.id, type: item.type })}
                          className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 hover:text-red-700 bg-white border border-gray-200 hover:bg-red-50 dark:bg-transparent dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredHistory.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No history found for the selected filter.</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Analysis"
        message="Are you sure you want to delete this analysis? This action cannot be undone."
      />
    </div>
  );
}
