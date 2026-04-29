import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import StatsCard from "../components/StatsCard.jsx";
import TrendChart from "../components/TrendChart.jsx";

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

  return (
    <div className="px-6 pb-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Repo Quality Dashboard</h1>
          <p className="text-sm text-mist/70">
            Analyze a GitHub repository for complexity, duplication, and style
            trends.
          </p>
        </div>

        <div className="bg-panel rounded-2xl p-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-mist/70">Owner</label>
            <input
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              className="mt-2 w-full rounded-lg bg-ink/60 border border-tide/30 px-3 py-2 focus:outline-none focus:border-tide"
              placeholder="octocat"
            />
          </div>
          <div>
            <label className="text-sm text-mist/70">Repository</label>
            <input
              value={repo}
              onChange={(event) => setRepo(event.target.value)}
              className="mt-2 w-full rounded-lg bg-ink/60 border border-tide/30 px-3 py-2 focus:outline-none focus:border-tide"
              placeholder="hello-world"
            />
          </div>
          <div>
            <label className="text-sm text-mist/70">Branch (optional)</label>
            <input
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              className="mt-2 w-full rounded-lg bg-ink/60 border border-tide/30 px-3 py-2 focus:outline-none focus:border-tide"
              placeholder="main"
            />
          </div>
          <div>
            <label className="text-sm text-mist/70">
              GitHub Token (optional)
            </label>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-2 w-full rounded-lg bg-ink/60 border border-tide/30 px-3 py-2 focus:outline-none focus:border-tide"
              placeholder="ghp_xxx"
              type="password"
            />
          </div>
          <div>
            <label className="text-sm text-mist/70">Commits to analyze</label>
            <input
              type="number"
              min={1}
              max={25}
              value={maxCommits}
              onChange={(event) => setMaxCommits(Number(event.target.value))}
              className="mt-2 w-full rounded-lg bg-ink/60 border border-tide/30 px-3 py-2 focus:outline-none focus:border-tide"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="rounded-full bg-neon text-ink px-6 py-2 font-semibold hover:bg-neon/90 disabled:opacity-60"
            >
              {loading ? "Analyzing..." : "Analyze Repo"}
            </button>
          </div>
        </div>

        {result && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

            <div className="bg-panel rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Quality Score Trend</h2>
                <span className="text-xs text-mist/60">
                  {result.analyzedCommits} commits analyzed
                </span>
              </div>
              <TrendChart data={trendData} />
            </div>

            <div className="bg-panel rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Commit Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-mist/60">
                      <th className="py-2">Date</th>
                      <th className="py-2">Message</th>
                      <th className="py-2">Score</th>
                      <th className="py-2">Complexity</th>
                      <th className="py-2">Dup %</th>
                      <th className="py-2">Style</th>
                      <th className="py-2">Files</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.commits.map((commit) => (
                      <tr key={commit.sha} className="border-t border-tide/10">
                        <td className="py-3">
                          {commit.date
                            ? new Date(commit.date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td
                          className="py-3 max-w-xs truncate"
                          title={commit.message}
                        >
                          {commit.message}
                        </td>
                        <td className="py-3 font-semibold text-neon">
                          {commit.score}
                        </td>
                        <td className="py-3">{commit.complexity}</td>
                        <td className="py-3">{commit.duplicationPercent}%</td>
                        <td className="py-3">{commit.styleIssues}</td>
                        <td className="py-3">{commit.filesAnalyzed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
