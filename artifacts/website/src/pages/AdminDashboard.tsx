import { useState, useEffect, useCallback } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  Mail,
  ArrowUpDown,
  Download,
  Search,
  LogIn,
  BarChart3,
  MessageSquare,
  Phone,
  Building2,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Bell,
  Play,
  ExternalLink,
  Save,
  ShieldBan,
  Plus,
  Trash2,
} from "lucide-react";
import { getApiRoot } from "@/lib/api";

const INQUIRY_STATUSES = ["New", "Contacted", "In Progress", "Closed"] as const;

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

interface Inquiry {
  id: number;
  formType: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  businessName: string | null;
  industry: string | null;
  servicesInterested: string[] | null;
  monthlyRevenueRange: string | null;
  biggestChallenge: string | null;
  preferredContactMethod: string | null;
  status: string;
  createdAt: string;
}

interface Subscriber {
  id: number;
  email: string;
  signupSource: string;
  active: boolean;
  subscribedAt: string;
}

interface SuppressionEntry {
  id: number;
  email: string;
  reason: string;
  createdAt: string;
}

interface Stats {
  inquiries: {
    total: number;
    byStatus: Record<string, number>;
  };
  newsletter: {
    total: number;
    active: number;
  };
}

interface NexusSummaryItem {
  stateCode: string;
  stateName: string;
  clientCount: number;
  foreignQualificationThreshold: number;
  bookkeepingLicenseRequired: boolean;
  bookkeepingLicenseNotes: string | null;
  authorityName: string | null;
  authorityUrl: string | null;
  notes: string | null;
  warningThresholdPercent: number;
  riskLevel: "safe" | "warning" | "alert";
  lastNotificationSent: string | null;
  lastNotificationType: string | null;
}

interface NexusNotification {
  id: number;
  stateCode: string;
  notificationType: string;
  clientCount: number;
  threshold: number;
  sentAt: string;
}

type SortField = "createdAt" | "name" | "status" | "formType";
type SortDir = "asc" | "desc";

function getStatusColor(status: string) {
  switch (status) {
    case "New":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "Contacted":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "In Progress":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "Closed":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  usePageTitle("Admin Dashboard");

  const seo = <SEO title="Admin Dashboard" noindex />;

  const [authenticated, setAuthenticated] = useState(!!getAdminToken());
  const [tokenInput, setTokenInput] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [nexusSummary, setNexusSummary] = useState<NexusSummaryItem[]>([]);
  const [nexusNotifications, setNexusNotifications] = useState<
    NexusNotification[]
  >([]);
  const [nexusLoading, setNexusLoading] = useState(false);
  const [showZeroStates, setShowZeroStates] = useState(false);
  const [editingState, setEditingState] = useState<string | null>(null);
  const [editThreshold, setEditThreshold] = useState("");
  const [editWarning, setEditWarning] = useState("");
  const [runningCheck, setRunningCheck] = useState(false);
  const [suppressionList, setSuppressionList] = useState<SuppressionEntry[]>(
    [],
  );
  const [showAddSuppression, setShowAddSuppression] = useState(false);
  const [newSuppressionEmail, setNewSuppressionEmail] = useState("");
  const [suppressionSearch, setSuppressionSearch] = useState("");
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [inqRes, nlRes, statsRes, suppRes] = await Promise.all([
        fetch(`${getApiRoot()}/admin/inquiries`, { headers: adminHeaders() }),
        fetch(`${getApiRoot()}/admin/newsletter`, { headers: adminHeaders() }),
        fetch(`${getApiRoot()}/admin/stats`, { headers: adminHeaders() }),
        fetch(`${getApiRoot()}/admin/suppression`, { headers: adminHeaders() }),
      ]);

      if (
        inqRes.status === 401 ||
        nlRes.status === 401 ||
        statsRes.status === 401
      ) {
        sessionStorage.removeItem("admin_token");
        setAuthenticated(false);
        return;
      }

      if (inqRes.ok) setInquiries(await inqRes.json());
      if (nlRes.ok) {
        const nlData = await nlRes.json();
        setSubscribers(nlData.subscribers);
      }
      if (statsRes.ok) setStats(await statsRes.json());
      if (suppRes.ok) setSuppressionList(await suppRes.json());
    } catch {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchNexusData = useCallback(async () => {
    setNexusLoading(true);
    try {
      const [summaryRes, notifRes] = await Promise.all([
        fetch(`${getApiRoot()}/admin/nexus/summary`, {
          headers: adminHeaders(),
        }),
        fetch(`${getApiRoot()}/admin/nexus/notifications`, {
          headers: adminHeaders(),
        }),
      ]);

      if (summaryRes.status === 401 || notifRes.status === 401) {
        sessionStorage.removeItem("admin_token");
        setAuthenticated(false);
        return;
      }

      if (summaryRes.ok) setNexusSummary(await summaryRes.json());
      if (notifRes.ok) setNexusNotifications(await notifRes.json());
    } catch {
      toast({
        title: "Error",
        description: "Failed to load nexus data",
        variant: "destructive",
      });
    } finally {
      setNexusLoading(false);
    }
  }, [toast]);

  const handleRunCheck = async () => {
    setRunningCheck(true);
    try {
      const res = await fetch(`${getApiRoot()}/admin/nexus/check`, {
        method: "POST",
        headers: adminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        toast({
          title: "Nexus Check Complete",
          description: `${data.warnings} warning(s), ${data.alerts} alert(s) sent`,
        });
        fetchNexusData();
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to run nexus check",
        variant: "destructive",
      });
    } finally {
      setRunningCheck(false);
    }
  };

  const handleSaveThreshold = async (stateCode: string) => {
    try {
      const body: Record<string, unknown> = {};
      if (editThreshold)
        body.foreignQualificationThreshold = parseInt(editThreshold, 10);
      if (editWarning) body.warningThresholdPercent = parseInt(editWarning, 10);

      const res = await fetch(
        `${getApiRoot()}/admin/nexus/rules/${stateCode}`,
        {
          method: "PATCH",
          headers: adminHeaders(),
          body: JSON.stringify(body),
        },
      );

      if (res.ok) {
        toast({
          title: "Updated",
          description: `Thresholds updated for ${stateCode}`,
        });
        setEditingState(null);
        fetchNexusData();
      } else {
        const err = await res.json();
        toast({
          title: "Error",
          description: err.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to save",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchData();
      fetchNexusData();
    }
  }, [authenticated, fetchData, fetchNexusData]);

  const handleLogin = () => {
    if (!tokenInput.trim()) return;
    setAdminToken(tokenInput.trim());
    setAuthenticated(true);
    setTokenInput("");
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`${getApiRoot()}/admin/inquiries/${id}/status`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        sessionStorage.removeItem("admin_token");
        setAuthenticated(false);
        return;
      }

      if (res.ok) {
        const updated = await res.json();
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? updated : inq)),
        );
        toast({
          title: "Status updated",
          description: `Inquiry #${id} marked as "${newStatus}"`,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleAddSuppression = async () => {
    if (!newSuppressionEmail.trim()) return;
    try {
      const res = await fetch(`${getApiRoot()}/admin/suppression`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({
          email: newSuppressionEmail.trim(),
          reason: "manual",
        }),
      });
      if (res.status === 401) {
        sessionStorage.removeItem("admin_token");
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        const entry = await res.json();
        setSuppressionList((prev) => {
          const exists = prev.some((e) => e.id === entry.id);
          return exists ? prev : [entry, ...prev];
        });
        setNewSuppressionEmail("");
        setShowAddSuppression(false);
        toast({
          title: "Email suppressed",
          description: `${entry.email} added to suppression list`,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to add suppression entry",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSuppression = async (id: number, email: string) => {
    try {
      const res = await fetch(`${getApiRoot()}/admin/suppression/${id}`, {
        method: "DELETE",
        headers: adminHeaders(),
      });
      if (res.status === 401) {
        sessionStorage.removeItem("admin_token");
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        setSuppressionList((prev) => prev.filter((e) => e.id !== id));
        toast({
          title: "Entry removed",
          description: `${email} removed from suppression list`,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove suppression entry",
        variant: "destructive",
      });
    }
  };

  const filteredSuppressionList = suppressionList.filter((entry) => {
    if (!suppressionSearch) return true;
    const q = suppressionSearch.toLowerCase();
    return (
      entry.email.toLowerCase().includes(q) ||
      entry.reason.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const token = getAdminToken();
    fetch(`${getApiRoot()}/admin/newsletter/export`, {
      headers: { "x-admin-token": token || "" },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "newsletter_subscribers.csv";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to export CSV",
          variant: "destructive",
        });
      });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filteredInquiries = inquiries
    .filter((inq) => {
      if (statusFilter !== "all" && inq.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          inq.name.toLowerCase().includes(q) ||
          inq.email.toLowerCase().includes(q) ||
          (inq.businessName?.toLowerCase().includes(q) ?? false) ||
          (inq.phone?.includes(q) ?? false)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const aVal = a[sortField] ?? "";
      const bVal = b[sortField] ?? "";
      if (sortField === "createdAt") {
        return (new Date(aVal).getTime() - new Date(bVal).getTime()) * dir;
      }
      return String(aVal).localeCompare(String(bVal)) * dir;
    });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
        {seo}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#111827] border border-white/10 rounded-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <LogIn className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">
                Enter your admin token to continue
              </p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <Input
              type="password"
              placeholder="Admin token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="bg-[#0a0e1a] border-white/10 text-white"
            />
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {seo}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Lead Management</h1>
              <p className="text-gray-400 mt-1">
                Track inquiries and manage your pipeline
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
              className="border-white/10 text-gray-300 hover:text-white"
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Inquiries"
                value={stats.inquiries.total}
                icon={<MessageSquare className="w-5 h-5" />}
                color="indigo"
              />
              <StatCard
                label="New Leads"
                value={stats.inquiries.byStatus["New"] ?? 0}
                icon={<Users className="w-5 h-5" />}
                color="blue"
              />
              <StatCard
                label="In Progress"
                value={
                  (stats.inquiries.byStatus["Contacted"] ?? 0) +
                  (stats.inquiries.byStatus["In Progress"] ?? 0)
                }
                icon={<BarChart3 className="w-5 h-5" />}
                color="purple"
              />
              <StatCard
                label="Active Subscribers"
                value={stats.newsletter.active}
                icon={<Mail className="w-5 h-5" />}
                color="emerald"
              />
            </div>
          )}

          <Tabs defaultValue="inquiries" className="space-y-6">
            <TabsList className="bg-[#111827] border border-white/10">
              <TabsTrigger
                value="inquiries"
                className="data-[state=active]:bg-indigo-600"
              >
                Inquiries
              </TabsTrigger>
              <TabsTrigger
                value="subscribers"
                className="data-[state=active]:bg-indigo-600"
              >
                Newsletter
              </TabsTrigger>
              <TabsTrigger
                value="nexus"
                className="data-[state=active]:bg-indigo-600"
              >
                <MapPin className="w-4 h-4 mr-1" />
                State Nexus
              </TabsTrigger>
              <TabsTrigger
                value="suppression"
                className="data-[state=active]:bg-indigo-600"
              >
                Suppression List
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inquiries" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search by name, email, phone, or business..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#111827] border-white/10 text-white"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] bg-[#111827] border-white/10 text-white">
                    <Filter className="w-4 h-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111827] border-white/10">
                    <SelectItem value="all">All Statuses</SelectItem>
                    {INQUIRY_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <SortableHead
                          field="createdAt"
                          current={sortField}
                          dir={sortDir}
                          onSort={toggleSort}
                        >
                          Date
                        </SortableHead>
                        <SortableHead
                          field="name"
                          current={sortField}
                          dir={sortDir}
                          onSort={toggleSort}
                        >
                          Name
                        </SortableHead>
                        <TableHead className="text-gray-400">Contact</TableHead>
                        <SortableHead
                          field="formType"
                          current={sortField}
                          dir={sortDir}
                          onSort={toggleSort}
                        >
                          Service
                        </SortableHead>
                        <SortableHead
                          field="status"
                          current={sortField}
                          dir={sortDir}
                          onSort={toggleSort}
                        >
                          Status
                        </SortableHead>
                        <TableHead className="text-gray-400 w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInquiries.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center text-gray-500 py-12"
                          >
                            {loading
                              ? "Loading inquiries..."
                              : "No inquiries found"}
                          </TableCell>
                        </TableRow>
                      )}
                      {filteredInquiries.map((inq) => (
                        <InquiryRow
                          key={inq.id}
                          inquiry={inq}
                          expanded={expandedRow === inq.id}
                          onToggle={() =>
                            setExpandedRow(
                              expandedRow === inq.id ? null : inq.id,
                            )
                          }
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="px-4 py-3 border-t border-white/10 text-sm text-gray-500">
                  Showing {filteredInquiries.length} of {inquiries.length}{" "}
                  inquiries
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscribers" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-400">
                  {stats && (
                    <span>
                      {stats.newsletter.active} active /{" "}
                      {stats.newsletter.total} total subscribers
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="border-white/10 text-gray-300 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-gray-400">Email</TableHead>
                        <TableHead className="text-gray-400">Source</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400">
                          Subscribed
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-gray-500 py-12"
                          >
                            {loading
                              ? "Loading subscribers..."
                              : "No subscribers yet"}
                          </TableCell>
                        </TableRow>
                      )}
                      {subscribers.map((sub) => (
                        <TableRow
                          key={sub.id}
                          className="border-white/10 hover:bg-white/5"
                        >
                          <TableCell className="text-white font-medium">
                            {sub.email}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {sub.signupSource}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                sub.active
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30"
                              }
                            >
                              {sub.active ? "Active" : "Unsubscribed"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {formatDate(sub.subscribedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nexus" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-400">
                  {(() => {
                    const alertCount = nexusSummary.filter(
                      (s) => s.riskLevel === "alert",
                    ).length;
                    const warningCount = nexusSummary.filter(
                      (s) => s.riskLevel === "warning",
                    ).length;
                    const withClients = nexusSummary.filter(
                      (s) => s.clientCount > 0,
                    ).length;
                    return (
                      <span>
                        {withClients} states with clients · {alertCount} alert
                        {alertCount !== 1 ? "s" : ""} · {warningCount} warning
                        {warningCount !== 1 ? "s" : ""}
                      </span>
                    );
                  })()}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowZeroStates(!showZeroStates)}
                    className="border-white/10 text-gray-300 hover:text-white"
                  >
                    {showZeroStates ? "Hide" : "Show"} Empty States
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRunCheck}
                    disabled={runningCheck}
                    className="border-white/10 text-gray-300 hover:text-white"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    {runningCheck ? "Running..." : "Run Check Now"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="suppression" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search by email or reason..."
                    value={suppressionSearch}
                    onChange={(e) => setSuppressionSearch(e.target.value)}
                    className="pl-10 bg-[#111827] border-white/10 text-white"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAddSuppression(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Email
                </Button>
              </div>

              <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-gray-400">State</TableHead>
                        <TableHead className="text-gray-400">Clients</TableHead>
                        <TableHead className="text-gray-400">
                          Threshold
                        </TableHead>
                        <TableHead className="text-gray-400">
                          Warning %
                        </TableHead>
                        <TableHead className="text-gray-400">Risk</TableHead>
                        <TableHead className="text-gray-400">License</TableHead>
                        <TableHead className="text-gray-400">
                          Last Notification
                        </TableHead>
                        <TableHead className="text-gray-400">
                          Requirements
                        </TableHead>
                        <TableHead className="text-gray-400 w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nexusSummary
                        .filter((s) => showZeroStates || s.clientCount > 0)
                        .sort((a, b) => {
                          const riskOrder = { alert: 0, warning: 1, safe: 2 };
                          if (
                            riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]
                          ) {
                            return (
                              riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
                            );
                          }
                          return b.clientCount - a.clientCount;
                        })
                        .map((item) => (
                          <TableRow
                            key={item.stateCode}
                            className="border-white/10 hover:bg-white/5"
                          >
                            <TableCell>
                              <div className="font-medium text-white">
                                {item.stateName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.stateCode}
                              </div>
                            </TableCell>
                            <TableCell className="text-white font-bold text-lg">
                              {item.clientCount}
                            </TableCell>
                            <TableCell>
                              {editingState === item.stateCode ? (
                                <Input
                                  type="number"
                                  value={editThreshold}
                                  onChange={(e) =>
                                    setEditThreshold(e.target.value)
                                  }
                                  className="w-20 h-8 bg-[#0a0e1a] border-white/10 text-white text-sm"
                                />
                              ) : (
                                <span className="text-gray-300">
                                  {item.foreignQualificationThreshold}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingState === item.stateCode ? (
                                <Input
                                  type="number"
                                  value={editWarning}
                                  onChange={(e) =>
                                    setEditWarning(e.target.value)
                                  }
                                  className="w-20 h-8 bg-[#0a0e1a] border-white/10 text-white text-sm"
                                />
                              ) : (
                                <span className="text-gray-300">
                                  {item.warningThresholdPercent}%
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  item.riskLevel === "alert"
                                    ? "bg-red-500/20 text-red-300 border-red-500/30"
                                    : item.riskLevel === "warning"
                                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                }
                              >
                                {item.riskLevel === "alert" ? (
                                  <ShieldAlert className="w-3 h-3 mr-1" />
                                ) : item.riskLevel === "warning" ? (
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                ) : (
                                  <ShieldCheck className="w-3 h-3 mr-1" />
                                )}
                                {item.riskLevel.charAt(0).toUpperCase() +
                                  item.riskLevel.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.bookkeepingLicenseRequired ? (
                                <Badge
                                  variant="outline"
                                  className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                                >
                                  Required
                                </Badge>
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  No
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-gray-400 text-sm">
                              {item.lastNotificationSent ? (
                                <div>
                                  <div>
                                    {formatDate(item.lastNotificationSent)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {item.lastNotificationType}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-600">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-gray-400 text-sm max-w-[200px]">
                              <div className="flex items-start gap-1">
                                <span className="truncate">
                                  {item.notes || "Standard nexus rules"}
                                </span>
                                {item.authorityUrl && (
                                  <a
                                    href={item.authorityUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 hover:text-indigo-300 shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {editingState === item.stateCode ? (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 w-7 p-0 border-emerald-500/30 text-emerald-400"
                                    onClick={() =>
                                      handleSaveThreshold(item.stateCode)
                                    }
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 w-7 p-0 border-white/10 text-gray-400"
                                    onClick={() => setEditingState(null)}
                                  >
                                    ✕
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-gray-500 hover:text-white"
                                  onClick={() => {
                                    setEditingState(item.stateCode);
                                    setEditThreshold(
                                      String(
                                        item.foreignQualificationThreshold,
                                      ),
                                    );
                                    setEditWarning(
                                      String(item.warningThresholdPercent),
                                    );
                                  }}
                                >
                                  ✎
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      {nexusSummary.filter(
                        (s) => showZeroStates || s.clientCount > 0,
                      ).length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center text-gray-500 py-12"
                          >
                            {nexusLoading
                              ? "Loading nexus data..."
                              : "No states with active clients"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {nexusNotifications.length > 0 && (
                <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    Notification History
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {nexusNotifications.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={
                              n.notificationType === "alert"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            }
                          >
                            {n.notificationType}
                          </Badge>
                          <span className="text-white text-sm font-medium">
                            {n.stateCode}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {n.clientCount} / {n.threshold} clients
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {formatDate(n.sentAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="suppression" className="space-y-4">
              <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-gray-400">Email</TableHead>
                        <TableHead className="text-gray-400">Reason</TableHead>
                        <TableHead className="text-gray-400">
                          Date Added
                        </TableHead>
                        <TableHead className="text-gray-400 w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppressionList.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-gray-500 py-12"
                          >
                            {loading
                              ? "Loading suppression list..."
                              : "No suppressed emails"}
                          </TableCell>
                        </TableRow>
                      )}
                      {filteredSuppressionList.map((entry) => (
                        <TableRow
                          key={entry.id}
                          className="border-white/10 hover:bg-white/5"
                        >
                          <TableCell className="text-white font-medium">
                            {entry.email}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getReasonColor(entry.reason)}
                            >
                              {formatReason(entry.reason)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {formatDate(entry.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveSuppression(entry.id, entry.email)
                              }
                              className="h-8 w-8 p-0 text-gray-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="px-4 py-3 border-t border-white/10 text-sm text-gray-500">
                  {filteredSuppressionList.length} suppressed email
                  {filteredSuppressionList.length !== 1 ? "s" : ""}
                </div>
              </div>

              <Dialog
                open={showAddSuppression}
                onOpenChange={setShowAddSuppression}
              >
                <DialogContent className="bg-[#111827] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <ShieldBan className="w-5 h-5 text-indigo-400" />
                      Add to Suppression List
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <Input
                      placeholder="Email address to suppress"
                      value={newSuppressionEmail}
                      onChange={(e) => setNewSuppressionEmail(e.target.value)}
                      className="bg-[#0a0e1a] border-white/10 text-white"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSuppression();
                      }}
                    />
                    <p className="text-sm text-gray-400">
                      This email will no longer receive any outbound emails from
                      the system.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddSuppression(false)}
                      className="border-white/10 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddSuppression}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Suppress Email
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/20 text-indigo-400",
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
  };
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}
        >
          {icon}
        </div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function SortableHead({
  field,
  current,
  dir,
  onSort,
  children,
}: {
  field: SortField;
  current: SortField;
  dir: SortDir;
  onSort: (f: SortField) => void;
  children: React.ReactNode;
}) {
  const active = field === current;
  return (
    <TableHead
      className="text-gray-400 cursor-pointer select-none hover:text-white transition-colors"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-1">
        {children}
        {active ? (
          dir === "asc" ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
        )}
      </span>
    </TableHead>
  );
}

function InquiryRow({
  inquiry,
  expanded,
  onToggle,
  onStatusChange,
}: {
  inquiry: Inquiry;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: number, status: string) => void;
}) {
  const services = inquiry.servicesInterested?.join(", ") || inquiry.formType;

  return (
    <>
      <TableRow
        className="border-white/10 hover:bg-white/5 cursor-pointer"
        onClick={onToggle}
      >
        <TableCell className="text-gray-400 text-sm whitespace-nowrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(inquiry.createdAt)}
          </div>
        </TableCell>
        <TableCell>
          <div className="font-medium text-white">{inquiry.name}</div>
          {inquiry.businessName && (
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3 h-3" />
              {inquiry.businessName}
            </div>
          )}
        </TableCell>
        <TableCell>
          <div className="text-sm text-gray-300">{inquiry.email}</div>
          {inquiry.phone && (
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3" />
              {inquiry.phone}
            </div>
          )}
        </TableCell>
        <TableCell className="text-gray-300 text-sm">{services}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Select
            value={inquiry.status}
            onValueChange={(val) => onStatusChange(inquiry.id, val)}
          >
            <SelectTrigger
              className={`w-[130px] h-8 text-xs border ${getStatusColor(inquiry.status)} bg-transparent`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111827] border-white/10">
              {INQUIRY_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Eye
            className={`w-4 h-4 transition-colors ${expanded ? "text-indigo-400" : "text-gray-600"}`}
          />
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow className="border-white/10 bg-white/[0.02]">
          <TableCell colSpan={6}>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="py-2 px-2 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {inquiry.industry && (
                  <DetailItem label="Industry" value={inquiry.industry} />
                )}
                {inquiry.monthlyRevenueRange && (
                  <DetailItem
                    label="Monthly Revenue"
                    value={inquiry.monthlyRevenueRange}
                  />
                )}
                {inquiry.preferredContactMethod && (
                  <DetailItem
                    label="Preferred Contact"
                    value={inquiry.preferredContactMethod}
                  />
                )}
                {inquiry.formType && (
                  <DetailItem label="Form Type" value={inquiry.formType} />
                )}
              </div>
              {(inquiry.message || inquiry.biggestChallenge) && (
                <div className="bg-[#0a0e1a] rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Message
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {inquiry.biggestChallenge || inquiry.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-gray-300 hover:text-white text-xs h-7"
                  onClick={() =>
                    window.open(`mailto:${inquiry.email}`, "_blank")
                  }
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
                {inquiry.phone && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-gray-300 hover:text-white text-xs h-7"
                    onClick={() =>
                      window.open(`tel:${inquiry.phone}`, "_blank")
                    }
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                )}
              </div>
            </motion.div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function getReasonColor(reason: string) {
  switch (reason) {
    case "unsubscribed":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "bounced":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "spam_complaint":
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    case "manual":
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
}

function formatReason(reason: string) {
  switch (reason) {
    case "unsubscribed":
      return "Unsubscribed";
    case "bounced":
      return "Bounced";
    case "spam_complaint":
      return "Spam Complaint";
    case "manual":
      return "Manual";
    default:
      return reason;
  }
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500 text-xs uppercase tracking-wider">
        {label}
      </span>
      <p className="text-gray-300 mt-0.5">{value}</p>
    </div>
  );
}
