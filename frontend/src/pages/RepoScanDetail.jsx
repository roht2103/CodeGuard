import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import StatsCard from "../components/StatsCard.jsx";
import TrendChart from "../components/TrendChart.jsx";
import { Card } from "../components/Card.jsx";

export default function RepoScanDetail() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScan = async () => {
      try {
        const response = await api.get(`/api/repos/scans/${id}`);
        setResult(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load repo scan.");
      } finally {
        setLoading(false);
      }
    };

    loadScan();
  }, [id]);

  const trendData = useMemo(() => {
    if (!result?.commits) return [];
    return result.commits.map((commit) => ({
      date: commit.date?.slice(0, 10) || "",
      score: commit.score,
    }));
  }, [result]);

  const summary = useMemo(() => {
    if (!result?.commits?.length) return null;
    const totals = result.commits.reduce(
      (acc, commit) => {
        acc.score += commit.score;
        acc.complexity += commit.complexity;
        acc.duplication += commit.duplicationPercent;
        acc.style += commit.styleIssues;
        acc.files += commit.filesAnalyzed;
        return acc;
      },
      { score: 0, complexity: 0, duplication: 0, style: 0, files: 0 },
    );
    const count = result.commits.length;
    return {
      avgScore: Math.round(totals.score / count),
      avgComplexity: Math.round(totals.complexity / count),
      avgDuplication: Math.round(totals.duplication / count),
      avgStyle: Math.round(totals.style / count),
      files: totals.files,
    };
  }, [result]);

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-12 text-center text-gray-500 dark:text-gray-400">
            <div className="animate-pulse">Loading scan details...</div>
          </Card>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-12 text-center text-gray-500 dark:text-gray-400">
            Scan not found.
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {result.owner}/{result.repo}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-md">
                {result.branch || "default branch"}
              </span>
              <span>• Scanned on {new Date(result.scannedAt).toLocaleString()}</span>
            </div>
          </div>
          <Link className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors" to="/history">
            &larr; Back to History
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <StatsCard label="Avg Score" value={summary?.avgScore ?? 0} />
          <StatsCard
            label="Avg Complexity"
            value={summary?.avgComplexity ?? 0}
          />
          <StatsCard
            label="Avg Duplication %"
            value={summary?.avgDuplication ?? 0}
          />
          <StatsCard
            label="Avg Style Issues"
            value={summary?.avgStyle ?? 0}
          />
          <StatsCard label="Files Analyzed" value={summary?.files ?? 0} />
        </div>

        <Card className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Quality Score Trend</h2>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10">
              {result.analyzedCommits} commits analyzed
            </span>
          </div>
          <TrendChart data={trendData} />
        </Card>

        <Card className="overflow-hidden p-0 border-gray-200 dark:border-white/10">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-white/5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Commit Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400/70 bg-gray-50/50 dark:bg-transparent">
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Message</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-right">Score</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-right">Complexity</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-right">Dup %</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-right">Style</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-right">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {result.commits.map((commit) => (
                  <tr key={commit.sha} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {commit.date
                        ? new Date(commit.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td
                      className="px-6 py-4 max-w-xs truncate font-medium text-gray-900 dark:text-white"
                      title={commit.message}
                    >
                      {commit.message}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-blue-600 dark:text-indigo-400">
                      {commit.score}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">{commit.complexity}</td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">{commit.duplicationPercent}%</td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">{commit.styleIssues}</td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">{commit.filesAnalyzed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
