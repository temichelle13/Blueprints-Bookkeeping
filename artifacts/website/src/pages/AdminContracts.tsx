import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Send,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Settings,
  Upload,
  Download,
} from "lucide-react";
import { getApiRoot } from "@/lib/api";

function getAdminToken(): string | null {
  return sessionStorage.getItem("admin_token");
}

function setAdminToken(token: string): void {
  sessionStorage.setItem("admin_token", token);
}

function adminHeaders(): Record<string, string> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["x-admin-token"] = token;
  return headers;
}

interface Contract {
  id: number;
  clientName: string;
  clientEmail: string;
  contractType: string;
  status: string;
  serviceType: string | null;
  pricingTier: string | null;
  sentAt: string | null;
  signedAt: string | null;
  expiredAt: string | null;
  signedDocumentUrl: string | null;
  remindersSent: number;
  createdAt: string;
}

interface ContractTemplate {
  id: number;
  name: string;
  contractType: string;
  adobeTemplateId: string | null;
  triggerCondition: string;
  description: string | null;
  active: string;
  createdAt: string;
}

interface ClientDocument {
  id: number;
  clientName: string;
  clientEmail: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  uploadedAt: string;
}

interface AdobeStatus {
  configured: boolean;
  message: string;
}

interface ApiErrorPayload {
  message?: string;
  error?: string;
  details?: unknown;
}

const CONTRACT_TYPES = [
  { value: "engagement_letter", label: "Client Engagement Letter" },
  { value: "mutual_nda", label: "Mutual NDA" },
  { value: "data_processing_agreement", label: "Data Processing Agreement" },
  { value: "scope_change", label: "Scope Change / Add-On Agreement" },
];

const TRIGGER_CONDITIONS = [
  { value: "service_booking", label: "Service Booking" },
  { value: "discovery_call", label: "Discovery Call" },
  { value: "recurring_client", label: "Recurring Client" },
  { value: "manual", label: "Manual Only" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "signed":
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Signed
        </Badge>
      );
    case "sent":
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Send className="w-3 h-3 mr-1" />
          Sent
        </Badge>
      );
    case "viewed":
      return (
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
          <Eye className="w-3 h-3 mr-1" />
          Viewed
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <XCircle className="w-3 h-3 mr-1" />
          Expired
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Draft
        </Badge>
      );
  }
}

function getContractTypeLabel(type: string) {
  return (
    CONTRACT_TYPES.find((t) => t.value === type)?.label ||
    type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminContracts() {
  usePageTitle("Admin — Contracts");

  const seo = <SEO title="Admin — Contracts" noindex />;

  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [adobeStatus, setAdobeStatus] = useState<AdobeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(!!getAdminToken());
  const [tokenInput, setTokenInput] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [adobeStatusError, setAdobeStatusError] = useState<string | null>(null);

  const [sendForm, setSendForm] = useState({
    clientName: "",
    clientEmail: "",
    contractType: "",
    serviceType: "",
    pricingTier: "",
    startDate: "",
  });

  const [templateForm, setTemplateForm] = useState({
    name: "",
    contractType: "",
    adobeTemplateId: "",
    triggerCondition: "",
    description: "",
  });

  async function fetchContracts() {
    try {
      const res = await fetch(`${getApiRoot()}/contracts`, {
        headers: adminHeaders(),
      });
      if (res.status === 401 || res.status === 503) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }
      setAuthenticated(true);
      const data = await res.json();
      setContracts(data);
    } catch (err) {
      console.error("Failed to fetch contracts:", err);
    }
  }

  async function parseServerErrorPayload(
    res: Response,
  ): Promise<ApiErrorPayload | string | null> {
    const rawText = await res.text();
    if (!rawText) return null;

    try {
      return JSON.parse(rawText) as ApiErrorPayload;
    } catch {
      return rawText;
    }
  }

  function getErrorMessage(
    payload: ApiErrorPayload | string | null,
    fallback: string,
  ) {
    if (!payload) return fallback;
    if (typeof payload === "string") return payload;
    return payload.message || payload.error || fallback;
  }

  async function fetchTemplates() {
    try {
      const res = await fetch(`${getApiRoot()}/contracts/templates/list`, {
        headers: adminHeaders(),
      });

      if (res.status === 401 || res.status === 503) {
        setAuthenticated(false);
        setTemplatesError(
          "Your admin session is unavailable. Sign in again to load templates.",
        );
        return;
      }

      if (!res.ok) {
        const payload = await parseServerErrorPayload(res);
        console.error("Failed to fetch templates:", {
          status: res.status,
          payload,
        });
        const message = getErrorMessage(payload, "Could not load templates.");
        setTemplatesError(message);
        toast({
          title: "Template Load Failed",
          description: message,
          variant: "destructive",
        });
        return;
      }

      const data = await res.json();
      setTemplates(data);
      setTemplatesError(null);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
      const message = "Could not load templates. Please retry.";
      setTemplatesError(message);
      toast({
        title: "Template Load Failed",
        description: message,
        variant: "destructive",
      });
    }
  }

  async function fetchDocuments() {
    try {
      const res = await fetch(`${getApiRoot()}/documents`, {
        headers: adminHeaders(),
      });

      if (res.status === 401 || res.status === 503) {
        setAuthenticated(false);
        setDocumentsError(
          "Your admin session is unavailable. Sign in again to load documents.",
        );
        return;
      }

      if (!res.ok) {
        const payload = await parseServerErrorPayload(res);
        console.error("Failed to fetch documents:", {
          status: res.status,
          payload,
        });
        const message = getErrorMessage(payload, "Could not load documents.");
        setDocumentsError(message);
        toast({
          title: "Document Load Failed",
          description: message,
          variant: "destructive",
        });
        return;
      }

      const data = await res.json();
      setDocuments(data);
      setDocumentsError(null);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      const message = "Could not load documents. Please retry.";
      setDocumentsError(message);
      toast({
        title: "Document Load Failed",
        description: message,
        variant: "destructive",
      });
    }
  }

  async function fetchAdobeStatus() {
    try {
      const res = await fetch(`${getApiRoot()}/contracts/adobe/status`, {
        headers: adminHeaders(),
      });

      if (res.status === 401 || res.status === 503) {
        setAuthenticated(false);
        setAdobeStatusError(
          "Your admin session is unavailable. Sign in again to load Adobe status.",
        );
        return;
      }

      if (!res.ok) {
        const payload = await parseServerErrorPayload(res);
        console.error("Failed to fetch Adobe status:", {
          status: res.status,
          payload,
        });
        const message = getErrorMessage(
          payload,
          "Could not load Adobe Sign status.",
        );
        setAdobeStatusError(message);
        toast({
          title: "Adobe Status Failed",
          description: message,
          variant: "destructive",
        });
        return;
      }

      const data = await res.json();
      setAdobeStatus(data);
      setAdobeStatusError(null);
    } catch (err) {
      console.error("Failed to fetch Adobe status:", err);
      const message = "Could not load Adobe Sign status. Please retry.";
      setAdobeStatusError(message);
      toast({
        title: "Adobe Status Failed",
        description: message,
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    Promise.allSettled([
      fetchContracts(),
      fetchTemplates(),
      fetchDocuments(),
      fetchAdobeStatus(),
    ]).finally(() => setLoading(false));
  }, []);

  async function handleSyncAll() {
    setSyncing(true);
    try {
      const res = await fetch(`${getApiRoot()}/contracts/sync-all`, {
        method: "POST",
        headers: adminHeaders(),
      });
      const data = await res.json();
      toast({
        title: "Sync Complete",
        description: `Synced ${data.synced} contract(s) with Adobe Sign.`,
      });
      await fetchContracts();
    } catch (err) {
      toast({
        title: "Sync Failed",
        description: "Could not sync contracts.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  }

  async function handleSendContract() {
    if (
      !sendForm.clientName ||
      !sendForm.clientEmail ||
      !sendForm.contractType
    ) {
      toast({
        title: "Missing Fields",
        description: "Name, email, and contract type are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`${getApiRoot()}/contracts/send`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify(sendForm),
      });

      if (!res.ok) throw new Error("Send failed");

      toast({
        title: "Contract Sent",
        description: `Contract sent to ${sendForm.clientEmail}.`,
      });
      setSendDialogOpen(false);
      setSendForm({
        clientName: "",
        clientEmail: "",
        contractType: "",
        serviceType: "",
        pricingTier: "",
        startDate: "",
      });
      await fetchContracts();
    } catch (err) {
      toast({
        title: "Send Failed",
        description: "Could not send contract.",
        variant: "destructive",
      });
    }
  }

  async function handleCreateTemplate() {
    if (
      !templateForm.name ||
      !templateForm.contractType ||
      !templateForm.triggerCondition
    ) {
      toast({
        title: "Missing Fields",
        description: "Name, type, and trigger are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`${getApiRoot()}/contracts/templates`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify(templateForm),
      });

      if (!res.ok) throw new Error("Create failed");

      toast({
        title: "Template Created",
        description: `Template "${templateForm.name}" created.`,
      });
      setTemplateDialogOpen(false);
      setTemplateForm({
        name: "",
        contractType: "",
        adobeTemplateId: "",
        triggerCondition: "",
        description: "",
      });
      await fetchTemplates();
    } catch (err) {
      toast({
        title: "Create Failed",
        description: "Could not create template.",
        variant: "destructive",
      });
    }
  }

  const filteredContracts =
    statusFilter === "all"
      ? contracts
      : contracts.filter((c) => c.status === statusFilter);

  const counts = {
    all: contracts.length,
    sent: contracts.filter((c) => c.status === "sent").length,
    signed: contracts.filter((c) => c.status === "signed").length,
    expired: contracts.filter((c) => c.status === "expired").length,
    draft: contracts.filter((c) => c.status === "draft").length,
  };

  async function handleLogin() {
    if (!tokenInput.trim()) return;
    setAdminToken(tokenInput.trim());
    setTokenInput("");
    setLoading(true);
    await Promise.allSettled([
      fetchContracts(),
      fetchTemplates(),
      fetchDocuments(),
      fetchAdobeStatus(),
    ]);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        {seo}
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        {seo}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 max-w-md w-full mx-4"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 mb-6">
            Enter the admin token to access the contract dashboard.
          </p>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Admin token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="bg-[#0a0e1a] border-indigo-500/20"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] py-12">
      {seo}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Contract Management
              </h1>
              <p className="text-gray-400 mt-1">
                Manage contracts via Adobe Acrobat Sign
              </p>
            </div>
            <div className="flex items-center gap-3">
              {adobeStatusError && (
                <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300">
                  <span>{adobeStatusError}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAdobeStatus}
                    className="h-7 border-red-500/40 text-red-300 hover:bg-red-500/20"
                  >
                    Retry
                  </Button>
                </div>
              )}
              {adobeStatus && (
                <Badge
                  className={
                    adobeStatus.configured
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {adobeStatus.configured
                    ? "Adobe Sign Connected"
                    : "Adobe Sign Not Connected"}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncAll}
                disabled={syncing}
                className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`}
                />
                Sync All
              </Button>
              <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send Contract
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#121830] border-indigo-500/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Send Contract</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Client Name *</Label>
                      <Input
                        value={sendForm.clientName}
                        onChange={(e) =>
                          setSendForm((p) => ({
                            ...p,
                            clientName: e.target.value,
                          }))
                        }
                        className="bg-[#0a0e1a] border-indigo-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Client Email *</Label>
                      <Input
                        type="email"
                        value={sendForm.clientEmail}
                        onChange={(e) =>
                          setSendForm((p) => ({
                            ...p,
                            clientEmail: e.target.value,
                          }))
                        }
                        className="bg-[#0a0e1a] border-indigo-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contract Type *</Label>
                      <Select
                        value={sendForm.contractType}
                        onValueChange={(v) =>
                          setSendForm((p) => ({ ...p, contractType: v }))
                        }
                      >
                        <SelectTrigger className="bg-[#0a0e1a] border-indigo-500/20">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#121830] border-indigo-500/20">
                          {CONTRACT_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Service Type</Label>
                      <Input
                        value={sendForm.serviceType}
                        onChange={(e) =>
                          setSendForm((p) => ({
                            ...p,
                            serviceType: e.target.value,
                          }))
                        }
                        className="bg-[#0a0e1a] border-indigo-500/20"
                        placeholder="e.g. Advanced Bookkeeping"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Pricing Tier</Label>
                        <Input
                          value={sendForm.pricingTier}
                          onChange={(e) =>
                            setSendForm((p) => ({
                              ...p,
                              pricingTier: e.target.value,
                            }))
                          }
                          className="bg-[#0a0e1a] border-indigo-500/20"
                          placeholder="e.g. $500/mo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={sendForm.startDate}
                          onChange={(e) =>
                            setSendForm((p) => ({
                              ...p,
                              startDate: e.target.value,
                            }))
                          }
                          className="bg-[#0a0e1a] border-indigo-500/20"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleSendContract}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Contract
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="contracts" className="space-y-6">
            <TabsList className="bg-[#121830] border border-indigo-500/20">
              <TabsTrigger
                value="contracts"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Contracts ({counts.all})
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Client Documents ({documents.length})
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Templates ({templates.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contracts" className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {(["all", "sent", "signed", "expired", "draft"] as const).map(
                  (s) => (
                    <Button
                      key={s}
                      variant={statusFilter === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(s)}
                      className={
                        statusFilter === s
                          ? "bg-indigo-600 text-white"
                          : "border-indigo-500/20 text-gray-400 hover:bg-indigo-500/10"
                      }
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s] ?? 0}
                      )
                    </Button>
                  ),
                )}
              </div>

              <div className="glass-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-indigo-500/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Client</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Sent</TableHead>
                      <TableHead className="text-gray-400">Signed</TableHead>
                      <TableHead className="text-gray-400">Reminders</TableHead>
                      <TableHead className="text-gray-400">Document</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-gray-500 py-12"
                        >
                          No contracts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContracts.map((contract) => (
                        <TableRow
                          key={contract.id}
                          className="border-indigo-500/10 hover:bg-indigo-500/5"
                        >
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">
                                {contract.clientName}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {contract.clientEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {getContractTypeLabel(contract.contractType)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(contract.status)}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {formatDate(contract.sentAt)}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {formatDate(contract.signedAt)}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {contract.remindersSent}
                          </TableCell>
                          <TableCell>
                            {contract.status === "signed" ? (
                              <a
                                href={`${getApiRoot()}/contracts/${contract.id}/document`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const url = `${getApiRoot()}/contracts/${contract.id}/document`;
                                  fetch(url, { headers: adminHeaders() })
                                    .then((r) => {
                                      if (!r.ok)
                                        throw new Error(
                                          "Failed to fetch document",
                                        );
                                      return r.blob();
                                    })
                                    .then((blob) => {
                                      const blobUrl = URL.createObjectURL(blob);
                                      window.open(blobUrl, "_blank");
                                    })
                                    .catch((err) =>
                                      console.error(
                                        "Document download error:",
                                        err,
                                      ),
                                    );
                                }}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View PDF
                              </a>
                            ) : (
                              <span className="text-gray-600 text-sm">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchDocuments()}
                  className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-sm text-indigo-100">
                  Public upload-link sharing has been retired. Continue using
                  this dashboard for internal document review only.
                </div>
              </div>

              {documentsError && (
                <div className="glass-card border border-red-500/30 bg-red-500/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-red-300">{documentsError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchDocuments}
                      className="border-red-500/40 text-red-300 hover:bg-red-500/20"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}

              <div className="glass-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-indigo-500/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Client</TableHead>
                      <TableHead className="text-gray-400">File Name</TableHead>
                      <TableHead className="text-gray-400">Size</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Uploaded</TableHead>
                      <TableHead className="text-gray-400">Download</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500 py-12"
                        >
                          No documents uploaded yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      documents.map((doc) => (
                        <TableRow
                          key={doc.id}
                          className="border-indigo-500/10 hover:bg-indigo-500/5"
                        >
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">
                                {doc.clientName}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {doc.clientEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300 text-sm">
                            {doc.originalName}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {doc.fileSize < 1024 * 1024
                              ? (doc.fileSize / 1024).toFixed(1) + " KB"
                              : (doc.fileSize / (1024 * 1024)).toFixed(1) +
                                " MB"}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {doc.mimeType.split("/").pop()?.toUpperCase()}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {formatDate(doc.uploadedAt)}
                          </TableCell>
                          <TableCell>
                            <button
                              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm"
                              onClick={() => {
                                const url = `${getApiRoot()}/documents/${doc.id}/download`;
                                fetch(url, { headers: adminHeaders() })
                                  .then((r) => {
                                    if (!r.ok)
                                      throw new Error("Download failed");
                                    return r.blob();
                                  })
                                  .then((blob) => {
                                    const blobUrl = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = blobUrl;
                                    a.download = doc.originalName;
                                    a.click();
                                    URL.revokeObjectURL(blobUrl);
                                  })
                                  .catch((err) =>
                                    console.error("Download error:", err),
                                  );
                              }}
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="flex justify-end">
                <Dialog
                  open={templateDialogOpen}
                  onOpenChange={setTemplateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      Add Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#121830] border-indigo-500/20 text-white">
                    <DialogHeader>
                      <DialogTitle>Add Contract Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Template Name *</Label>
                        <Input
                          value={templateForm.name}
                          onChange={(e) =>
                            setTemplateForm((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                          className="bg-[#0a0e1a] border-indigo-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contract Type *</Label>
                        <Select
                          value={templateForm.contractType}
                          onValueChange={(v) =>
                            setTemplateForm((p) => ({ ...p, contractType: v }))
                          }
                        >
                          <SelectTrigger className="bg-[#0a0e1a] border-indigo-500/20">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#121830] border-indigo-500/20">
                            {CONTRACT_TYPES.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Trigger Condition *</Label>
                        <Select
                          value={templateForm.triggerCondition}
                          onValueChange={(v) =>
                            setTemplateForm((p) => ({
                              ...p,
                              triggerCondition: v,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-[#0a0e1a] border-indigo-500/20">
                            <SelectValue placeholder="Select trigger" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#121830] border-indigo-500/20">
                            {TRIGGER_CONDITIONS.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Adobe Template ID</Label>
                        <Input
                          value={templateForm.adobeTemplateId}
                          onChange={(e) =>
                            setTemplateForm((p) => ({
                              ...p,
                              adobeTemplateId: e.target.value,
                            }))
                          }
                          className="bg-[#0a0e1a] border-indigo-500/20"
                          placeholder="From Adobe Sign library"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={templateForm.description}
                          onChange={(e) =>
                            setTemplateForm((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                          className="bg-[#0a0e1a] border-indigo-500/20"
                        />
                      </div>
                      <Button
                        onClick={handleCreateTemplate}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        Create Template
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {templatesError && (
                <div className="glass-card border border-red-500/30 bg-red-500/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-red-300">{templatesError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchTemplates}
                      className="border-red-500/40 text-red-300 hover:bg-red-500/20"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}

              <div className="glass-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-indigo-500/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Trigger</TableHead>
                      <TableHead className="text-gray-400">Adobe ID</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500 py-12"
                        >
                          No templates configured. Add a template to get
                          started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      templates.map((t) => (
                        <TableRow
                          key={t.id}
                          className="border-indigo-500/10 hover:bg-indigo-500/5"
                        >
                          <TableCell className="text-white font-medium">
                            {t.name}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {getContractTypeLabel(t.contractType)}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {TRIGGER_CONDITIONS.find(
                              (tc) => tc.value === t.triggerCondition,
                            )?.label || t.triggerCondition}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm font-mono">
                            {t.adobeTemplateId
                              ? t.adobeTemplateId.slice(0, 12) + "..."
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                t.active === "true"
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                              }
                            >
                              {t.active === "true" ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {formatDate(t.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
