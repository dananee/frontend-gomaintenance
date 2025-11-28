"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { UserActivityLog } from "@/features/users/components/UserActivityLog";
import { Mail, Phone, MapPin, Calendar, Shield, Edit, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Mock hook - replace with actual hook
function useUser(id: string) {
  return {
    data: {
      id,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      role: "technician",
      status: "active",
      department: "Maintenance",
      joinDate: "2023-01-15",
      lastActive: "2024-11-28T14:30:00Z",
      avatarUrl: "",
      location: "Main Workshop",
      skills: ["Engine Repair", "Electrical Systems", "Diagnostics"],
      certifications: ["ASE Master Technician", "Ford Certified"],
    },
    isLoading: false,
  };
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: user, isLoading } = useUser(params?.id ?? "");

  if (isLoading) {
    return <Skeleton className="h-[60vh] w-full" />;
  }

  if (!user) {
    return <div className="text-sm text-gray-500">User not found.</div>;
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700" />
        <CardContent className="relative pb-6 pt-0">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <Avatar className="-mt-12 h-24 w-24 border-4 border-white shadow-lg dark:border-gray-950">
              <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="mt-4 flex-1 space-y-1 sm:mt-0 sm:pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <Badge variant={user.status === "active" ? "success" : "secondary"}>
                  {user.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                <span className="capitalize">{user.role}</span>
                <span>•</span>
                <span>{user.department}</span>
              </p>
            </div>
            <div className="mt-4 flex gap-2 sm:mt-0 sm:pb-2">
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatDate(user.joinDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {user.certifications.map((cert) => (
                      <li key={cert} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <UserActivityLog userId={user.id} />
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{user.role}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Full access to work orders and vehicle maintenance records.
                      </p>
                    </div>
                    <Badge>Current Role</Badge>
                  </div>
                </div>
                
                {/* Mock permissions list */}
                <div className="grid gap-2 sm:grid-cols-2">
                  {["Create Work Orders", "Edit Work Orders", "View Vehicles", "Update Inventory", "View Reports"].map((perm) => (
                    <div key={perm} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{perm}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="h-4 w-4 text-gray-300" />
                    <span className="line-through">Manage Users</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="h-4 w-4 text-gray-300" />
                    <span className="line-through">System Settings</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
