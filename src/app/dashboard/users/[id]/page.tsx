"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  BadgeCheck,
  CalendarRange,
  FileUp,
  Mail,
  Pencil,
  ShieldHalf,
  Smartphone,
  UserRound,
  Ban,
  CheckCircle,
  Building2,
  Clock,
  MapPin,
  Briefcase,
  Award,
  TrendingUp,
  Target,
  Activity,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Download,
  X,
  Send,
  ClipboardList,
  Timer,
  BarChart3,
  Wrench,
  Filter,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DetailPageSkeleton } from "@/components/ui/skeleton";
import { useModal } from "@/hooks/useModal";
import { useUsersStore } from "@/features/users/store/useUsersStore";
import { EditUserModal } from "@/features/users/components/EditUserModal";
import { getInitials } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  rolePermissions,
  type Permission,
  type Role,
} from "@/lib/rbac/permissions";
import { Progress } from "@/components/ui/progress";

interface Attachment {
  id: number;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  url?: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  isPinned?: boolean;
}

interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  verified: boolean;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status: "active" | "expiring" | "expired";
  documentUrl?: string;
}

interface AssignedWorkOrder {
  id: string;
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "completed";
  dueDate: string;
  vehicle: string;
}

const defaultAttachments: Attachment[] = [
  {
    id: 1,
    name: "Training-certs.pdf",
    size: "500 KB",
    type: "pdf",
    uploadedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Driver-license.png",
    size: "900 KB",
    type: "image",
    uploadedAt: "2024-02-20",
  },
];

const defaultComments: Comment[] = [
  {
    id: 1,
    author: "HR Bot",
    text: "Annual safety training completed.",
    timestamp: "Mar 1, 4:14 PM",
  },
  {
    id: 2,
    author: "Fleet Manager",
    text: "Consistently completes work orders ahead of schedule.",
    timestamp: "Feb 22, 10:05 AM",
  },
];

const activity = [
  {
    id: 1,
    action: "Completed Work Order #WO-214",
    date: "Today",
    type: "work_order",
    icon: CheckCircle,
  },
  {
    id: 2,
    action: "Added new vehicle note",
    date: "Mar 12",
    type: "note",
    icon: FileText,
  },
  {
    id: 3,
    action: "Reassigned WO-198",
    date: "Mar 9",
    type: "work_order",
    icon: ClipboardList,
  },
  {
    id: 4,
    action: "Updated inventory item",
    date: "Mar 8",
    type: "inventory",
    icon: Activity,
  },
  {
    id: 5,
    action: "Logged in from mobile",
    date: "Mar 7",
    type: "login",
    icon: Smartphone,
  },
];

const accessRoles = [
  {
    id: 1,
    role: "Technician",
    scope: "Maintenance",
    lastActive: "Today",
    description: "Can view and complete work orders",
  },
  {
    id: 2,
    role: "Dispatcher",
    scope: "Scheduling",
    lastActive: "Mar 10",
    description: "Can assign and schedule work",
  },
];

const mockSkills: Skill[] = [
  { id: "1", name: "Hydraulic Systems", level: "expert", verified: true },
  {
    id: "2",
    name: "Electrical Diagnostics",
    level: "advanced",
    verified: true,
  },
  { id: "3", name: "Welding", level: "intermediate", verified: false },
  { id: "4", name: "Engine Repair", level: "advanced", verified: true },
];

const mockCertifications: Certification[] = [
  {
    id: "1",
    name: "ASE Master Technician",
    issuer: "ASE",
    issueDate: "2022-03-15",
    expiryDate: "2027-03-15",
    status: "active",
  },
  {
    id: "2",
    name: "Forklift Operator License",
    issuer: "OSHA",
    issueDate: "2023-06-01",
    expiryDate: "2025-01-15",
    status: "expiring",
  },
  {
    id: "3",
    name: "Safety Training",
    issuer: "Safety Corp",
    issueDate: "2021-01-10",
    expiryDate: "2024-01-10",
    status: "expired",
  },
];

const mockAssignedWOs: AssignedWorkOrder[] = [
  {
    id: "WO-245",
    title: "Engine oil change - Fleet A",
    priority: "medium",
    status: "in_progress",
    dueDate: "2024-12-05",
    vehicle: "Ford F-150 #A123",
  },
  {
    id: "WO-248",
    title: "Brake inspection",
    priority: "high",
    status: "open",
    dueDate: "2024-12-03",
    vehicle: "Toyota Camry #B456",
  },
  {
    id: "WO-250",
    title: "Tire rotation",
    priority: "low",
    status: "open",
    dueDate: "2024-12-10",
    vehicle: "Honda Civic #C789",
  },
];

const roleColors: Record<string, { bg: string; text: string; border: string }> =
  {
    admin: {
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
    },
    manager: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    technician: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
    },
    viewer: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-700 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    },
  };

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.id as string;
  const users = useUsersStore((state) => state.users);
  const suspendUser = useUsersStore((state) => state.suspendUser);
  const reactivateUser = useUsersStore((state) => state.reactivateUser);

  const user = users.find((u) => u.id === userId);
  const [attachments, setAttachments] =
    useState<Attachment[]>(defaultAttachments);
  const [comments, setComments] = useState<Comment[]>(defaultComments);
  const [newComment, setNewComment] = useState("");
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [certifications, setCertifications] =
    useState<Certification[]>(mockCertifications);
  const [assignedWOs] = useState<AssignedWorkOrder[]>(mockAssignedWOs);

  const { isOpen, open, close } = useModal();
  const [isLoading] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<Attachment | null>(null);
  const [activityFilter, setActivityFilter] = useState<string>("all");

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <UserRound className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            User not found
          </p>
        </div>
      </div>
    );
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const uploads = Array.from(files).map((file) => {
      const fileType = file.name.split(".").pop()?.toLowerCase() || "file";
      return {
        id: Date.now() + Math.random(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: fileType,
        uploadedAt: new Date().toISOString().split("T")[0],
      };
    });
    setAttachments((prev) => [...uploads, ...prev]);
    toast.success("Files uploaded", {
      description: `${files.length} file(s) uploaded successfully.`,
    });
  };

  const handleSuspend = () => {
    if (confirm(`Are you sure you want to suspend ${user.name}?`)) {
      suspendUser(user.id);
      toast.success("User suspended", {
        description: `${user.name} has been suspended.`,
      });
    }
  };

  const handleReactivate = () => {
    reactivateUser(user.id);
    toast.success("User reactivated", {
      description: `${user.name} has been reactivated.`,
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(),
        author: "You",
        text: newComment.trim(),
        timestamp: "Just now",
        isPinned: false,
      },
      ...prev,
    ]);
    setNewComment("");
    toast.success("Note added successfully");
  };

  const handleInviteResend = () => {
    // Simulate API call
    toast.success("Invitation sent", {
      description: `Invitation email sent to ${user?.email}`,
    });
    setInviteDialogOpen(false);
  };

  const handleDeleteAttachment = (id: number) => {
    setAttachments((prev) => prev.filter((file) => file.id !== id));
    toast.success("File deleted");
  };

  const handlePinComment = (id: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? { ...comment, isPinned: !comment.isPinned }
          : comment
      )
    );
  };

  // KPI calculations for technicians
  const kpiData = useMemo(() => {
    if (user?.role !== "technician") return null;
    return {
      completedWOs: 47,
      avgCompletionTime: 3.2, // hours
      mttr: 4.1, // Mean Time To Repair in hours
      backlog: 3,
      productivity: 92, // percentage
    };
  }, [user?.role]);

  const roleColor = roleColors[user.role] || {
    bg: "bg-gray-50 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-700",
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section with improved spacing */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg dark:border-gray-800">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="text-2xl font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <Badge
                variant="outline"
                className={
                  user.status === "active"
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    : user.status === "suspended"
                    ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                    : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }
              >
                {user.status}
              </Badge>
              <Badge
                variant="outline"
                className={`${roleColor.bg} ${roleColor.text} ${roleColor.border} capitalize`}
              >
                <ShieldHalf className="mr-1 h-3 w-3" />
                {user.role}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>Last active {user.last_active || "Recently"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {user.status === "suspended" ? (
            <Button variant="outline" onClick={handleReactivate}>
              <CheckCircle className="mr-2 h-4 w-4" /> Reactivate
            </Button>
          ) : (
            <Button variant="outline" onClick={handleSuspend}>
              <Ban className="mr-2 h-4 w-4" /> Suspend
            </Button>
          )}
          <Button variant="outline" onClick={open}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
          <Button onClick={() => setInviteDialogOpen(true)}>
            <Send className="mr-2 h-4 w-4" /> Invite/Resend
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="overview" className="text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="roles" className="text-sm">
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-sm">
            Skills & Certs
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-sm">
            Activity
          </TabsTrigger>
          <TabsTrigger value="attachments" className="text-sm">
            Attachments
          </TabsTrigger>
          <TabsTrigger value="comments" className="text-sm">
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* User Information Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">
                  User Information
                </CardTitle>
              </div>
              <CardDescription>Personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.email}
                  </p>
                </div>
                {user.phone && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                      <Smartphone className="h-3.5 w-3.5" />
                      <span>Phone</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.phone}
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Job Title</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {user.role} Specialist
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Department</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Maintenance
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Site</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Main Facility
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Shift</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Day Shift (8AM - 5PM)
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <CalendarRange className="h-3.5 w-3.5" />
                    <span>Joined</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "Jan 2024"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <Activity className="h-3.5 w-3.5" />
                    <span>Last Active</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.last_active || "Recently"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI Dashboard for Technicians */}
          {kpiData && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl font-semibold">
                    Performance Metrics
                  </CardTitle>
                </div>
                <CardDescription>
                  Key performance indicators and productivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 dark:border-gray-700 dark:from-blue-900/20 dark:to-blue-800/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Completed WOs
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {kpiData.completedWOs}
                        </p>
                      </div>
                      <ClipboardList className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                      <TrendingUp className="inline h-3 w-3" /> +12% vs last
                      month
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 dark:border-gray-700 dark:from-purple-900/20 dark:to-purple-800/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Avg Completion
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {kpiData.avgCompletionTime}h
                        </p>
                      </div>
                      <Timer className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Per work order
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 dark:border-gray-700 dark:from-amber-900/20 dark:to-amber-800/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          MTTR
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {kpiData.mttr}h
                        </p>
                      </div>
                      <Wrench className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Mean time to repair
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-red-50 to-red-100/50 p-4 dark:border-gray-700 dark:from-red-900/20 dark:to-red-800/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Backlog
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {kpiData.backlog}
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Pending tasks
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-green-100/50 p-4 dark:border-gray-700 dark:from-green-900/20 dark:to-green-800/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Productivity
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {kpiData.productivity}%
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <Progress value={kpiData.productivity} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assigned Work Orders */}
          {assignedWOs.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl font-semibold">
                        Assigned Work Orders
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Current assignments and upcoming tasks
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {assignedWOs.length} active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignedWOs.map((wo) => (
                    <div
                      key={wo.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {wo.status === "in_progress" ? (
                            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          ) : wo.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {wo.id}
                            </p>
                            <Badge
                              variant="outline"
                              className={
                                wo.priority === "critical"
                                  ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400"
                                  : wo.priority === "high"
                                  ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400"
                                  : wo.priority === "medium"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
                                  : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800"
                              }
                            >
                              {wo.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {wo.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {wo.vehicle}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Due
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(wo.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldHalf className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl font-semibold">
                      Roles & Permissions
                    </CardTitle>
                  </div>
                  <CardDescription>
                    User access roles and permission levels
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Add Role
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPermissionDialogOpen(true)}
                  >
                    <Eye className="mr-1 h-4 w-4" /> View Permissions
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessRoles.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-5 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                        <ShieldHalf className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                            {item.role}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {item.scope}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Last active: {item.lastActive}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills & Certifications Tab - NEW */}
        <TabsContent value="skills" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl font-semibold">
                      Technical Skills
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Verified and self-reported technical competencies
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="mr-1 h-4 w-4" /> Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={
                          skill.level === "expert"
                            ? "rounded-full bg-purple-100 p-2 dark:bg-purple-900/30"
                            : skill.level === "advanced"
                            ? "rounded-full bg-blue-100 p-2 dark:bg-blue-900/30"
                            : skill.level === "intermediate"
                            ? "rounded-full bg-green-100 p-2 dark:bg-green-900/30"
                            : "rounded-full bg-gray-100 p-2 dark:bg-gray-800"
                        }
                      >
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {skill.name}
                          </p>
                          {skill.verified && (
                            <BadgeCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 capitalize">
                          {skill.level}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        skill.level === "expert"
                          ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400"
                          : skill.level === "advanced"
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
                          : skill.level === "intermediate"
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800"
                      }
                    >
                      {skill.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl font-semibold">
                      Certifications & Licenses
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Professional certifications and compliance documents
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="mr-1 h-4 w-4" /> Add Certification
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-start justify-between rounded-lg border border-gray-200 p-5 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={
                          cert.status === "active"
                            ? "mt-1 rounded-lg bg-green-100 p-2 dark:bg-green-900/30"
                            : cert.status === "expiring"
                            ? "mt-1 rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30"
                            : "mt-1 rounded-lg bg-red-100 p-2 dark:bg-red-900/30"
                        }
                      >
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {cert.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className={
                              cert.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                                : cert.status === "expiring"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
                                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400"
                            }
                          >
                            {cert.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Issued by {cert.issuer}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                          <span>
                            Issued:{" "}
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </span>
                          {cert.expiryDate && (
                            <span>
                              {cert.status === "expired"
                                ? "Expired"
                                : "Expires"}
                              : {new Date(cert.expiryDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {cert.documentUrl && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl font-semibold">
                      Recent Activity
                    </CardTitle>
                  </div>
                  <CardDescription>
                    User actions and system events
                  </CardDescription>
                </div>
                <Select
                  value={activityFilter}
                  onValueChange={setActivityFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activity</SelectItem>
                    <SelectItem value="work_order">Work Orders</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="login">Logins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {item.type.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.date}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl font-semibold">
                      Attachments
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Documents, certificates, and files
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="user-files"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("user-files")?.click()
                    }
                  >
                    <FileUp className="mr-2 h-4 w-4" /> Upload Files
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-start justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                      <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                      <p className="text-xs text-gray-400">
                        Uploaded {file.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewFile(file)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteAttachment(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">
                  Notes & Comments
                </CardTitle>
              </div>
              <CardDescription>
                Internal notes and communication history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a note or comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment}>
                    <Send className="mr-2 h-4 w-4" /> Post Note
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {comments
                  .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className={`rounded-lg border p-4 ${
                        comment.isPinned
                          ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                              {comment.author}
                            </p>
                            {comment.isPinned && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                              >
                                Pinned
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            {comment.text}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePinComment(comment.id)}
                            className={comment.isPinned ? "text-blue-600" : ""}
                          >
                            <BadgeCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite/Resend Email Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invitation Email</DialogTitle>
            <DialogDescription>
              Send an invitation or reminder email to {user?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input value={user?.email} disabled />
            </div>
            <div className="space-y-2">
              <Label>Message (Optional)</Label>
              <Textarea placeholder="Add a personal message..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleInviteResend}>
              <Send className="mr-2 h-4 w-4" /> Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permission Matrix Dialog */}
      <Dialog
        open={permissionDialogOpen}
        onOpenChange={setPermissionDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Role Permission Matrix</DialogTitle>
            <DialogDescription>
              Complete breakdown of permissions by role
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase text-muted-foreground">
                    Permission
                  </TableHead>
                  <TableHead className="text-xs uppercase text-center text-muted-foreground">
                    Admin
                  </TableHead>
                  <TableHead className="text-xs uppercase text-center text-muted-foreground">
                    Manager
                  </TableHead>
                  <TableHead className="text-xs uppercase text-center text-muted-foreground">
                    Technician
                  </TableHead>
                  <TableHead className="text-xs uppercase text-center text-muted-foreground">
                    Viewer
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(
                  rolePermissions.admin.reduce(
                    (acc, perm) => ({ ...acc, [perm]: true }),
                    {}
                  )
                ).map((permission) => (
                  <TableRow key={permission}>
                    <TableCell className="text-sm font-medium">
                      {permission
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </TableCell>
                    <TableCell className="text-center">
                      {rolePermissions.admin.includes(
                        permission as Permission
                      ) ? (
                        <CheckCircle className="mx-auto h-4 w-4 text-green-600" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-gray-300" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {rolePermissions.manager.includes(
                        permission as Permission
                      ) ? (
                        <CheckCircle className="mx-auto h-4 w-4 text-green-600" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-gray-300" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {rolePermissions.technician.includes(
                        permission as Permission
                      ) ? (
                        <CheckCircle className="mx-auto h-4 w-4 text-green-600" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-gray-300" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {rolePermissions.viewer.includes(
                        permission as Permission
                      ) ? (
                        <CheckCircle className="mx-auto h-4 w-4 text-green-600" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-gray-300" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setPermissionDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
            <DialogDescription>
              File preview - {previewFile?.size}
            </DialogDescription>
          </DialogHeader>
          <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <FileText className="h-16 w-16 text-gray-400" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewFile(null)}>
              Close
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditUserModal open={isOpen} onOpenChange={close} user={user} />
    </div>
  );
}
