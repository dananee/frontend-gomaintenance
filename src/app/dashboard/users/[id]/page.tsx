"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, CalendarRange, FileUp, Mail, Pencil, ShieldHalf, Smartphone, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/useModal";

interface Attachment {
  id: number;
  name: string;
  size: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

const defaultAttachments: Attachment[] = [
  { id: 1, name: "Training-certs.pdf", size: "500 KB" },
  { id: 2, name: "Driver-license.png", size: "900 KB" },
];

const defaultComments: Comment[] = [
  { id: 1, author: "HR Bot", text: "Annual safety training completed.", timestamp: "Mar 1, 4:14 PM" },
  {
    id: 2,
    author: "Fleet Manager",
    text: "Consistently completes work orders ahead of schedule.",
    timestamp: "Feb 22, 10:05 AM",
  },
];

const activity = [
  { id: 1, action: "Closed WO-214", date: "Today" },
  { id: 2, action: "Added new vehicle note", date: "Mar 12" },
  { id: 3, action: "Reassigned WO-198", date: "Mar 9" },
];

const accessRoles = [
  { id: 1, role: "Technician", scope: "Maintenance", lastActive: "Today" },
  { id: 2, role: "Dispatcher", scope: "Scheduling", lastActive: "Mar 10" },
];

export default function UserDetailsPage() {
  const [attachments, setAttachments] = useState<Attachment[]>(defaultAttachments);
  const [comments, setComments] = useState<Comment[]>(defaultComments);
  const [newComment, setNewComment] = useState("");
  const { isOpen, open, close } = useModal();

  const user = useMemo(
    () => ({
      name: "Alex Turner",
      email: "alex.turner@example.com",
      phone: "+1 (415) 555-0101",
      role: "Technician",
      status: "active",
      lastActive: "Today, 08:14",
    }),
    []
  );

  const handleFileUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const uploads = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    }));
    setAttachments((prev) => [...uploads, ...prev]);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      { id: Date.now(), author: "You", text: newComment.trim(), timestamp: "Just now" },
      ...prev,
    ]);
    setNewComment("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <Badge variant="outline" className="capitalize">
                {user.status}
              </Badge>
              <Badge className="capitalize">{user.role}</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last active {user.lastActive}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={open}>
            <Pencil className="mr-2 h-4 w-4" /> Edit User
          </Button>
          <Button>
            <BadgeCheck className="mr-2 h-4 w-4" /> Invite/Resend
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Mail className="h-4 w-4" /> {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Smartphone className="h-4 w-4" /> {user.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <CalendarRange className="h-4 w-4" /> Last active {user.lastActive}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessRoles.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <ShieldHalf className="h-4 w-4 text-gray-400" />
                          <span className="capitalize">{item.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.scope}</TableCell>
                      <TableCell>{item.lastActive}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-gray-400" />
                    <span>{item.action}</span>
                  </div>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attachments</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  id="user-files"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <label htmlFor="user-files">
                  <Button variant="outline" asChild>
                    <span className="flex items-center">
                      <FileUp className="mr-2 h-4 w-4" /> Upload
                    </span>
                  </Button>
                </label>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                  <Badge variant="secondary">PDF/Image</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a note"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment}>Post note</Button>
                </div>
              </div>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{comment.author}</p>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Modal isOpen={isOpen} onClose={close} title="Edit User" description="Update user contact and access.">
        <div className="space-y-4">
          <Input placeholder="Full name" defaultValue={user.name} />
          <Input placeholder="Email" defaultValue={user.email} />
          <Input placeholder="Phone" defaultValue={user.phone} />
          <div className="flex justify-end">
            <Button onClick={close}>Save changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

