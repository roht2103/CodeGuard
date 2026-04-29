import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import QualityScoreCircle from "../components/QualityScoreCircle.jsx";
import StatsCard from "../components/StatsCard.jsx";
import VulnerabilityCard from "../components/VulnerabilityCard.jsx";

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
    return <div className="px-6 pb-10">Loading scan...</div>;
  }

  if (!scan) {
    return <div className="px-6 pb-10">Scan not found.</div>;
  }

  return (
    <div className="px-6 pb-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold">{scan.fileName}</h1>
            <p className="text-sm text-mist/70">
              {scan.language} • {new Date(scan.scannedAt).toLocaleString()}
            </p>
          </div>
          <QualityScoreCircle score={scan.qualityScore} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="Critical" value={scan.criticalCount} />
          <StatsCard label="High" value={scan.highCount} />
          <StatsCard label="Medium" value={scan.mediumCount} />
          <StatsCard label="Low" value={scan.lowCount} />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Vulnerabilities</h2>
          <Link className="text-tide hover:underline" to="/dashboard">
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-4">
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
            <p className="text-mist/70">No vulnerabilities found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
