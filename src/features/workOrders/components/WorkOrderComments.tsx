"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  author: string;
  authorRole?: string;
  content: string;
  createdAt: string;
}

interface WorkOrderCommentsProps {
  comments?: Comment[];
}

export function WorkOrderComments({ comments = [] }: WorkOrderCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(
    comments.length > 0
      ? comments
      : [
          {
            id: "1",
            author: "Sarah Johnson",
            authorRole: "Technician",
            content:
              "Started work on brake inspection. Found significant wear on front pads.",
            createdAt: "2024-11-25T10:30:00Z",
          },
          {
            id: "2",
            author: "Mike Davis",
            authorRole: "Supervisor",
            content: "Approved parts order. Priority changed to high.",
            createdAt: "2024-11-25T11:15:00Z",
          },
          {
            id: "3",
            author: "Sarah Johnson",
            authorRole: "Technician",
            content:
              "Parts received. Will complete installation tomorrow morning.",
            createdAt: "2024-11-26T14:20:00Z",
          },
        ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: String(Date.now()),
      author: "Current User",
      authorRole: "Technician",
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    setLocalComments([...localComments, comment]);
    setNewComment("");
  };

  const handleDelete = (commentId: string) => {
    setLocalComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Comments & Notes</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Communicate with team members about this work order
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comment Input */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900/50">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                placeholder="Add a comment or note..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none bg-white dark:bg-gray-950"
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={!newComment.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  Post Comment
                </Button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          {localComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                No comments yet
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Be the first to comment
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {localComments.map((comment) => (
                <div
                  key={comment.id}
                  className="group rounded-lg border border-gray-200 dark:border-gray-800 p-4 transition-all hover:shadow-sm"
                >
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {comment.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {comment.author}
                          </span>
                          {comment.authorRole && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                              {comment.authorRole}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(comment.id)}
                          title="Delete comment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
