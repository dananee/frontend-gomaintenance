"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BadgeCheck,
  CalendarRange,
  FileUp,
  Pencil,
  User,
  Wrench,
} from "lucide-react";

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
  { id: 1, name: "Inspection-photos.zip", size: "4.6 MB" },
  { id: 2, name: "Technician-notes.pdf", size: "320 KB" },
];

const defaultComments: Comment[] = [
  {
    id: 1,
    author: "Casey Lee",
    text: "Waiting on parts delivery before closing the job.",
    timestamp: "Today, 8:42 AM",
  },
  {
    id: 2,
    author: "Jamie Doe",
    text: "Brake pads replaced. Test drive scheduled.",
    timestamp: "Yesterday, 3:10 PM",
  },
];

const tasks = [
  { id: 1, title: "Replace brake pads", status: "done", assignee: "Alex" },
  { id: 2, title: "Bleed brake lines", status: "in_progress", assignee: "Dana" },
  { id: 3, title: "Road test", status: "todo", assignee: "Casey" },
];

const timeline = [
  { id: 1, label: "Work order created", by: "Dispatcher", date: "Mar 11" },
  { id: 2, label: "Technician assigned (Alex)", by: "System", date: "Mar 12" },
  { id: 3, label: "Parts requested", by: "Alex Turner", date: "Mar 13" },
];

export default function WorkOrderDetailsPage() {
  const [attachments, setAttachments] = useState<Attachment[]>(defaultAttachments);
  const [comments, setComments] = useState<Comment[]>(defaultComments);
  const [newComment, setNewComment] = useState("");
  const { isOpen, open, close } = useModal();

  const workOrder = useMemo(
    () => ({
      id: "WO-214",
      title: "Brake inspection & pad replacement",
      priority: "high",
      status: "in_progress",
      vehicle: "Freightliner Cascadia",
      due: "Mar 20",
      assignee: "Alex Turner",
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
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{workOrder.title}</h1>
            <Badge variant="secondary" className="capitalize">{workOrder.status.replace("_", " ")}</Badge>
            <Badge className="capitalize">Priority: {workOrder.priority}</Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{workOrder.id} · Due {workOrder.due}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={open}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Work Order
          </Button>
          <Button>
            <BadgeCheck className="mr-2 h-4 w-4" /> Mark Complete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Activity className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{workOrder.status.replace("_", " ")}</div>
                <p className="text-xs text-gray-500">Updated today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due Date</CardTitle>
                <CalendarRange className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workOrder.due}</div>
                <p className="text-xs text-gray-500">Timeline commitment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vehicle</CardTitle>
                <Wrench className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workOrder.vehicle}</div>
                <p className="text-xs text-gray-500">Linked asset</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignee</CardTitle>
                <User className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>AT</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">{workOrder.assignee}</div>
                  <p className="text-xs text-gray-500">Technician</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-700">
                <p className="text-gray-500">Symptoms</p>
                <p className="mt-2 text-gray-900 dark:text-gray-100">
                  Driver reported vibration when braking at highway speeds. Initial inspection showed uneven pad wear.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-700">
                <p className="text-gray-500">Resolution Plan</p>
                <p className="mt-2 text-gray-900 dark:text-gray-100">
                  Replace front pads, resurface rotors if needed, and perform road test to confirm noise resolved.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task.status === "done"
                              ? "outline"
                              : task.status === "in_progress"
                              ? "secondary"
                              : "default"
                          }
                          className="capitalize"
                        >
                          {task.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.assignee}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attachments</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  id="wo-files"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <label htmlFor="wo-files">
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

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeline.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.by}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment}>Post comment</Button>
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

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Edit Work Order"
        description="Update work order status, assignee, or due date."
      >
        <div className="space-y-4">
          <Input placeholder="Title" defaultValue={workOrder.title} />
          <Input placeholder="Due date" defaultValue={workOrder.due} />
          <div className="flex justify-end">
            <Button onClick={close}>Save changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

