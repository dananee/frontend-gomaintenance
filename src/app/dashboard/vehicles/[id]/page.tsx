"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CalendarRange,
  FileUp,
  Fuel,
  Gauge,
  MapPin,
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
  { id: 1, name: "Registration.pdf", size: "220 KB" },
  { id: 2, name: "Inspection-2024.png", size: "1.2 MB" },
];

const defaultComments: Comment[] = [
  {
    id: 1,
    author: "Alex Turner",
    text: "Scheduled for oil change next week.",
    timestamp: "Today, 10:15 AM",
  },
  {
    id: 2,
    author: "Jordan Smith",
    text: "Please verify tire pressure before next trip.",
    timestamp: "Yesterday, 4:02 PM",
  },
];

const timeline = [
  { id: 1, label: "Work order WO-214 completed", by: "Alex Turner", date: "Today 09:20" },
  { id: 2, label: "Odometer updated to 124,500 km", by: "System", date: "Mar 12" },
  { id: 3, label: "Assigned to route east", by: "Dispatcher", date: "Mar 8" },
];

const relatedWorkOrders = [
  { id: "WO-214", issue: "Oil change + filters", status: "completed", due: "Today" },
  { id: "WO-198", issue: "Brake inspection", status: "in_progress", due: "Mar 20" },
];

const maintenancePlans = [
  { template: "Oil Change", nextDue: "2,500 km", date: "Apr 4" },
  { template: "Brake Inspection", nextDue: "5,000 km", date: "May 12" },
];

export default function VehicleDetailsPage() {
  const [attachments, setAttachments] = useState<Attachment[]>(defaultAttachments);
  const [comments, setComments] = useState<Comment[]>(defaultComments);
  const [newComment, setNewComment] = useState("");
  const { isOpen, open, close } = useModal();

  const vehicle = useMemo(
    () => ({
      name: "Freightliner Cascadia",
      status: "active",
      licensePlate: "ABC-1234",
      vin: "1FUJGEDR9CSBM1234",
      odometer: "124,500 km",
      fuelType: "Diesel",
      location: "San Francisco Yard",
      driver: "Jamie Doe",
    }),
    []
  );

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      { id: Date.now(), author: "You", text: newComment.trim(), timestamp: "Just now" },
      ...prev,
    ]);
    setNewComment("");
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const uploads = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    }));
    setAttachments((prev) => [...uploads, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{vehicle.name}</h1>
            <Badge variant="outline" className="capitalize">
              {vehicle.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Plate {vehicle.licensePlate} · VIN {vehicle.vin}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={open}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Vehicle
          </Button>
          <Button>
            <Wrench className="mr-2 h-4 w-4" /> Create Work Order
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
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
                <div className="text-2xl font-bold capitalize">{vehicle.status}</div>
                <p className="text-xs text-gray-500">Updated today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Odometer</CardTitle>
                <Gauge className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicle.odometer}</div>
                <p className="text-xs text-gray-500">Auto-synced</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fuel Type</CardTitle>
                <Fuel className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicle.fuelType}</div>
                <p className="text-xs text-gray-500">Primary fuel</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Location</CardTitle>
                <MapPin className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicle.location}</div>
                <p className="text-xs text-gray-500">Last check-in</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Related Work Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedWorkOrders.map((wo) => (
                      <TableRow key={wo.id}>
                        <TableCell className="font-medium">{wo.id}</TableCell>
                        <TableCell>{wo.issue}</TableCell>
                        <TableCell>
                          <Badge variant={wo.status === "completed" ? "outline" : "secondary"} className="capitalize">
                            {wo.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>{wo.due}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{vehicle.driver}</p>
                    <p className="text-sm text-gray-500">Primary driver</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarRange className="h-4 w-4" /> Next inspection: Apr 4
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" /> Fleet manager: Casey Lee
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenancePlans.map((plan) => (
                    <TableRow key={plan.template}>
                      <TableCell className="font-medium">{plan.template}</TableCell>
                      <TableCell>{plan.nextDue}</TableCell>
                      <TableCell>{plan.date}</TableCell>
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
                  id="vehicle-files"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <label htmlFor="vehicle-files">
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

      <Modal isOpen={isOpen} onClose={close} title="Edit Vehicle" description="Update vehicle details and assignments.">
        <div className="space-y-4">
          <Input placeholder="Vehicle name" defaultValue={vehicle.name} />
          <Input placeholder="License plate" defaultValue={vehicle.licensePlate} />
          <Input placeholder="VIN" defaultValue={vehicle.vin} />
          <div className="flex justify-end">
            <Button onClick={close}>Save changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

