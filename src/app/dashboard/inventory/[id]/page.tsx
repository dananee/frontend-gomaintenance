"use client";

import { useMemo, useState } from "react";
import { Activity, Archive, Boxes, FileUp, Package2, Pencil, TrendingDown } from "lucide-react";

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
  { id: 1, name: "Spec-sheet.pdf", size: "880 KB" },
  { id: 2, name: "Warehouse-photo.png", size: "1.1 MB" },
];

const defaultComments: Comment[] = [
  {
    id: 1,
    author: "Inventory Bot",
    text: "Low stock threshold reached. Consider reordering soon.",
    timestamp: "Today, 9:12 AM",
  },
  {
    id: 2,
    author: "Casey Lee",
    text: "Confirmed new supplier discount for bulk orders.",
    timestamp: "Yesterday, 6:20 PM",
  },
];

const movements = [
  { id: "MV-120", type: "In", qty: 25, location: "Warehouse A", date: "Mar 10" },
  { id: "MV-121", type: "Out", qty: 10, location: "Warehouse B", date: "Mar 12" },
];

const warehouses = [
  { name: "Warehouse A", stock: 30 },
  { name: "Warehouse B", stock: 18 },
  { name: "Mobile Van", stock: 6 },
];

export default function InventoryPartDetailsPage() {
  const [attachments, setAttachments] = useState<Attachment[]>(defaultAttachments);
  const [comments, setComments] = useState<Comment[]>(defaultComments);
  const [newComment, setNewComment] = useState("");
  const { isOpen, open, close } = useModal();

  const part = useMemo(
    () => ({
      name: "Brake Pad Set",
      sku: "BRK-4452",
      manufacturer: "ACME Parts",
      stock: 54,
      reorderPoint: 20,
      price: 125.5,
      category: "Brakes",
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

  const totalValue = useMemo(() => part.stock * part.price, [part.price, part.stock]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{part.name}</h1>
            <Badge variant="outline">SKU {part.sku}</Badge>
            <Badge className="capitalize">{part.category}</Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{part.manufacturer}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={open}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Part
          </Button>
          <Button>
            <Archive className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On Hand</CardTitle>
                <Boxes className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{part.stock} units</div>
                <p className="text-xs text-gray-500">Across all warehouses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reorder Point</CardTitle>
                <Activity className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{part.reorderPoint} units</div>
                <p className="text-xs text-gray-500">Threshold</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unit Price</CardTitle>
                <Package2 className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${part.price.toFixed(2)}</div>
                <p className="text-xs text-gray-500">Latest supplier cost</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <TrendingDown className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                <p className="text-xs text-gray-500">Qty × price</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((location) => (
                    <TableRow key={location.name} className={location.stock <= part.reorderPoint ? "bg-red-50/50 dark:bg-red-900/20" : undefined}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{location.stock} units</span>
                          {location.stock <= part.reorderPoint && (
                            <Badge variant="destructive" className="text-xs">
                              Low stock
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((move) => (
                    <TableRow key={move.id}>
                      <TableCell className="font-medium">{move.id}</TableCell>
                      <TableCell>
                        <Badge variant={move.type === "In" ? "secondary" : "outline"}>{move.type}</Badge>
                      </TableCell>
                      <TableCell>{move.qty}</TableCell>
                      <TableCell>{move.location}</TableCell>
                      <TableCell>{move.date}</TableCell>
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
                  id="part-files"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <label htmlFor="part-files">
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

      <Modal isOpen={isOpen} onClose={close} title="Edit Part" description="Update part metadata and pricing.">
        <div className="space-y-4">
          <Input placeholder="Part name" defaultValue={part.name} />
          <Input placeholder="SKU" defaultValue={part.sku} />
          <Input placeholder="Unit price" defaultValue={part.price.toString()} />
          <div className="flex justify-end">
            <Button onClick={close}>Save changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

