import { useState, useCallback, useRef } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  CheckCircle2,
  X,
  Shield,
  Lock,
  CloudUpload,
} from "lucide-react";
import { getApiRoot } from "@/lib/api";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".xlsx",
  ".doc",
  ".xls",
  ".jpg",
  ".jpeg",
  ".png",
  ".csv",
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileExtension(name: string): string {
  return "." + name.split(".").pop()?.toLowerCase();
}

function isAllowedFile(file: File): boolean {
  const ext = getFileExtension(file.name);
  return ALLOWED_EXTENSIONS.includes(ext) && file.size <= MAX_FILE_SIZE;
}

interface SelectedFile {
  file: File;
  id: string;
}

export default function ClientPortal() {
  usePageTitle("Secure Document Upload");

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const params = new URLSearchParams(window.location.search);
  const prefillName = params.get("name") || "";
  const prefillEmail = params.get("email") || "";

  const [clientName, setClientName] = useState(prefillName);
  const [clientEmail, setClientEmail] = useState(prefillEmail);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newFiles: SelectedFile[] = [];
      const rejected: string[] = [];

      Array.from(files).forEach((file) => {
        if (!isAllowedFile(file)) {
          rejected.push(file.name);
        } else {
          newFiles.push({
            file,
            id: `${file.name}-${Date.now()}-${Math.random()}`,
          });
        }
      });

      if (rejected.length > 0) {
        toast({
          title: "Files Rejected",
          description: `${rejected.join(", ")} — unsupported type or exceeds 25MB.`,
          variant: "destructive",
        });
      }

      setSelectedFiles((prev) => [...prev, ...newFiles]);
    },
    [toast],
  );

  const removeFile = useCallback((id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  async function handleUpload() {
    if (
      !clientName.trim() ||
      !clientEmail.trim() ||
      !clientEmail.includes("@")
    ) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and a valid email address.",
        variant: "destructive",
      });
      return;
    }
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append("clientName", clientName.trim());
    formData.append("clientEmail", clientEmail.trim());
    selectedFiles.forEach((sf) => {
      formData.append("files", sf.file);
    });

    try {
      setProgress(30);

      const res = await fetch(`${getApiRoot()}/documents/upload`, {
        method: "POST",
        body: formData,
      });

      setProgress(90);

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setProgress(100);
      setUploadedCount(data.documents?.length || selectedFiles.length);
      setUploadComplete(true);

      if (data.failedFiles && data.failedFiles.length > 0) {
        toast({
          title: "Partial Upload",
          description: `Some files failed to upload: ${data.failedFiles.join(", ")}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Upload Failed",
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  if (uploadComplete) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <SEO title="Secure Document Upload" noindex />
        <div
          className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center"
          style={{ minHeight: "60vh" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-10 text-center w-full"
          >
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              Documents Received
            </h2>
            <p className="text-muted-foreground mb-2">
              {uploadedCount} file{uploadedCount !== 1 ? "s" : ""} uploaded
              successfully.
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              A confirmation email has been sent to{" "}
              <span className="text-white font-medium">{clientEmail}</span>. Our
              team will review your documents shortly.
            </p>
            <button
              onClick={() => {
                setUploadComplete(false);
                setSelectedFiles([]);
                setProgress(0);
              }}
              className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-accent/20 transition-all"
            >
              Upload More Documents
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <SEO title="Secure Document Upload" noindex />
      <section className="py-12 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Secure Document Portal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Upload your financial documents securely — no email attachments
            needed.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-accent" />
              Encrypted Storage
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-accent" />
              Private & Secure
            </span>
            <span className="flex items-center gap-1.5">
              <CloudUpload className="w-4 h-4 text-accent" />
              Up to 25MB per file
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 md:p-10"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-lg bg-surface border border-white/[0.06] text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-2 focus:ring-accent/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Your Email *
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-surface border border-white/[0.06] text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-2 focus:ring-accent/10 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Documents
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  dragOver
                    ? "border-accent bg-accent/5"
                    : "border-white/[0.1] hover:border-accent/30 hover:bg-surface/50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ALLOWED_EXTENSIONS.join(",")}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-medium mb-1">
                  {dragOver ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-muted-foreground text-sm">
                  or click to browse
                </p>
                <p className="text-muted-foreground text-xs mt-3">
                  PDF, DOCX, XLSX, JPG, PNG, CSV — up to 25MB each
                </p>
              </div>
            </div>

            <AnimatePresence>
              {selectedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <p className="text-sm font-medium text-foreground">
                    {selectedFiles.length} file
                    {selectedFiles.length !== 1 ? "s" : ""} selected
                  </p>
                  {selectedFiles.map((sf) => (
                    <div
                      key={sf.id}
                      className="flex items-center gap-3 p-3 bg-surface/50 border border-white/[0.06] rounded-lg"
                    >
                      <FileText className="w-5 h-5 text-accent flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {sf.file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(sf.file.size)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(sf.id);
                        }}
                        className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Uploading securely...
                </p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              className="w-full py-4 bg-accent text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <CloudUpload className="w-5 h-5" />
              {uploading
                ? "Uploading..."
                : `Upload ${selectedFiles.length > 0 ? selectedFiles.length + " " : ""}Document${selectedFiles.length !== 1 ? "s" : ""}`}
            </button>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Your documents are encrypted and stored securely. Only authorized
            team members can access uploaded files.
          </p>
        </div>
      </section>
    </div>
  );
}
