"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
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
  workOrderId: string;
  comments?: Comment[];
}

export function WorkOrderComments({
  workOrderId,
  comments = [],
}: WorkOrderCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(
    comments.length > 0
      ? comments
      : [
          {
            id: "1",
            author: "Sarah Johnson",
            authorRole: "Technician",
            content: "Started work on brake inspection. Found significant wear on front pads.",
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
            content: "Parts received. Will complete installation tomorrow morning.",
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

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Comments & Notes
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Communicate with team members about this work order
        </p>
      </div>

      {/* Comment Input */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={!newComment.trim()}>
                <Send className="mr-2 h-4 w-4" />
                Post Comment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      {localComments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-600" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No comments yet
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Be the first to comment
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {localComments.map((comment) => (
            <Card key={comment.id} className="transition-shadow hover:shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {comment.author.charAt(0)}
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {comment.author}
                      </span>
                      {comment.authorRole && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {comment.authorRole}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
