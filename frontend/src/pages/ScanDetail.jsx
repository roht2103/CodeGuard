import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import QualityScoreCircle from "../components/QualityScoreCircle.jsx";
import StatsCard from "../components/StatsCard.jsx";
import VulnerabilityCard from "../components/VulnerabilityCard.jsx";
import { Card } from "../components/Card.jsx";

export default function ScanDetail() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScan = async () => {
      try {
        const response = await api.get(`/api/scans/${id}`);
        setScan(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load scan.");
      } finally {
        setLoading(false);
      }
    };

    loadScan();
  }, [id]);

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <Card className="p-12 text-center text-gray-500 dark:text-gray-400">
            <div className="animate-pulse">Loading scan details...</div>
          </Card>
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <Card className="p-12 text-center text-gray-500 dark:text-gray-400">
            Scan not found.
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {scan.fileName}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-500/20">
                {scan.language}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                • {new Date(scan.scannedAt).toLocaleString()}
              </span>
            </div>
          </div>
          <QualityScoreCircle score={scan.qualityScore} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="Critical" value={scan.criticalCount} />
          <StatsCard label="High" value={scan.highCount} />
          <StatsCard label="Medium" value={scan.mediumCount} />
          <StatsCard label="Low" value={scan.lowCount} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Vulnerabilities</h2>
          <Link className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors" to="/dashboard">
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6">
          {scan.vulnerabilities.map((vulnerability) => (
            <VulnerabilityCard
              key={
                vulnerability.id ||
                `${vulnerability.type}-${vulnerability.lineNumber}`
              }
              vulnerability={vulnerability}
            />
          ))}
          {scan.vulnerabilities.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No vulnerabilities found.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
