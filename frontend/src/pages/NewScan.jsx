import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";
import api from "../api/axios.js";
import { Card } from "../components/Card.jsx";
import { Button } from "../components/Button.jsx";

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
    <div className="px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            New Repo Scan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Drop a file to run the static analysis engine.
          </p>
        </div>

        <Card 
          className={`p-12 border-2 border-dashed flex flex-col items-center justify-center transition-all ${
            dragging 
              ? "border-blue-500 bg-blue-50/50 dark:border-indigo-500 dark:bg-indigo-900/20" 
              : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <UploadCloud className="text-blue-500 dark:text-indigo-400 mb-4" size={48} strokeWidth={1.5} />
          <p className="text-gray-600 dark:text-gray-300 font-medium">Drag & drop a file here, or</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="mt-4"
          >
            Browse files
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={allowedExtensions.join(",")}
            className="hidden"
            onChange={(event) => handleFile(event.target.files[0])}
          />
          {file && (
            <div className="mt-6 px-4 py-2 bg-blue-50 dark:bg-indigo-900/30 text-blue-700 dark:text-indigo-300 rounded-lg text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-indigo-400"></span>
              {file.name}
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="primary"
            size="lg"
          >
            {loading ? "Scanning..." : "Run Scan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
