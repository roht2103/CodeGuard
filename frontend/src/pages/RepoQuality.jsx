import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import StatsCard from "../components/StatsCard.jsx";
import TrendChart from "../components/TrendChart.jsx";
import { Card } from "../components/Card.jsx";
import { Button } from "../components/Button.jsx";

export default function RepoQuality() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("");
  const [token, setToken] = useState("");
  const [maxCommits, setMaxCommits] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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

  const handleAnalyze = async () => {
    if (!owner || !repo) {
      toast.error("Provide the GitHub owner and repo.");
      return;
    }
    if (!token) {
      toast.error("Provide a GitHub Token to perform the analysis.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/api/repos/analyze", {
        owner,
        repo,
        branch: branch || null,
        token: token || null,
        maxCommits,
      });
      setResult(response.data);
      toast.success("Repository analyzed.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-white/10 dark:bg-[#111827] dark:text-white dark:focus:border-white dark:focus:ring-white transition-all shadow-sm";
  const labelClasses = "block text-sm font-bold text-gray-700 dark:text-gray-300";

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Repo Quality Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Analyze a GitHub repository for complexity, duplication, and style trends.
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
            <label className={labelClasses}>Owner</label>
            <input
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              className={inputClasses}
              placeholder="octocat"
            />
          </div>
          <div>
            <label className={labelClasses}>Repository</label>
            <input
              value={repo}
              onChange={(event) => setRepo(event.target.value)}
              className={inputClasses}
              placeholder="hello-world"
            />
          </div>
          <div>
            <label className={labelClasses}>Branch (optional)</label>
            <input
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              className={inputClasses}
              placeholder="main"
            />
          </div>
          <div>
            <label className={labelClasses}>
              GitHub Token
            </label>
            <input
              required  
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className={inputClasses}
              placeholder="ghp_xxx"
              type="password"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Need a token? <a href="/docs" className="text-blue-600 hover:underline dark:text-blue-400">Read the docs</a>
            </p>
          </div>
          <div>
            <label className={labelClasses}>Commits to analyze</label>
            <input
              type="number"
              min={1}
              max={25}
              value={maxCommits}
              onChange={(event) => setMaxCommits(Number(event.target.value))}
              className={inputClasses}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              variant="primary"
            >
              {loading ? "Analyzing..." : "Analyze Repo"}
            </Button>
          </div>
          </div>
        </Card>

        {result && (
          <>
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

            <Card>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quality Score Trend</h2>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                  {result.analyzedCommits} commits analyzed
                </span>
              </div>
              <TrendChart data={trendData} />
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commit Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                      <th className="py-3 font-medium">Date</th>
                      <th className="py-3 font-medium">Message</th>
                      <th className="py-3 font-medium text-right">Score</th>
                      <th className="py-3 font-medium text-right">Complexity</th>
                      <th className="py-3 font-medium text-right">Dup %</th>
                      <th className="py-3 font-medium text-right">Style</th>
                      <th className="py-3 font-medium text-right">Files</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {result.commits.map((commit) => (
                      <tr key={commit.sha} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 text-gray-600 dark:text-gray-300">
                          {commit.date
                            ? new Date(commit.date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td
                          className="py-3 max-w-xs truncate font-medium text-gray-900 dark:text-white"
                          title={commit.message}
                        >
                          {commit.message}
                        </td>
                        <td className="py-3 text-right font-semibold text-blue-600 dark:text-indigo-400">
                          {commit.score}
                        </td>
                        <td className="py-3 text-right text-gray-600 dark:text-gray-300">{commit.complexity}</td>
                        <td className="py-3 text-right text-gray-600 dark:text-gray-300">{commit.duplicationPercent}%</td>
                        <td className="py-3 text-right text-gray-600 dark:text-gray-300">{commit.styleIssues}</td>
                        <td className="py-3 text-right text-gray-600 dark:text-gray-300">{commit.filesAnalyzed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
