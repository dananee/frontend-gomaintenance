"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/features/users/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useUser(params?.id ?? "");
  const [name, setName] = useState(data?.name || "");
  const [email, setEmail] = useState(data?.email || "");

  if (isLoading) return <Skeleton className="h-[30vh] w-full" />;
  if (!data) return <div className="text-sm text-gray-500">User not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">User Profile</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.name}</h1>
          <div className="mt-2 flex gap-2">
            <Badge variant="info">{data.role}</Badge>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
        <Button>Reset Password</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-gray-500">Name</p>
            <Input value={name || data.name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500">Email</p>
            <Input value={email || data.email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button className="w-full md:w-auto">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
