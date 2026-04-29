import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";
import api from "../api/axios.js";

const allowedExtensions = [".java", ".js", ".py"];

export default function NewScan() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (selected) => {
    if (!selected) return;
    const lower = selected.name.toLowerCase();
    if (!allowedExtensions.some((ext) => lower.endsWith(ext))) {
      toast.error("Only .java, .js, or .py files are allowed.");
      return;
    }
    setFile(selected);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Select a file to scan.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/api/scans/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Scan complete.");
      navigate(`/scans/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Scan failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pb-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">New Scan</h1>
          <p className="text-sm text-mist/70">
            Drop a file to run the static analysis engine.
          </p>
        </div>

        <div
          className={`bg-panel rounded-2xl p-10 border-2 border-dashed ${
            dragging ? "border-neon" : "border-tide/40"
          } text-center transition`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <UploadCloud className="mx-auto text-tide" size={42} />
          <p className="mt-4 text-mist/70">Drag & drop a file here, or</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 rounded-full border border-tide/50 px-4 py-2 text-tide hover:bg-tide/10"
          >
            Browse files
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={allowedExtensions.join(",")}
            className="hidden"
            onChange={(event) => handleFile(event.target.files[0])}
          />
          {file && (
            <p className="mt-4 text-sm text-neon">Selected: {file.name}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-full bg-neon text-ink px-6 py-2 font-semibold hover:bg-neon/90 disabled:opacity-60"
        >
          {loading ? "Scanning..." : "Run Scan"}
        </button>
      </div>
    </div>
  );
}
