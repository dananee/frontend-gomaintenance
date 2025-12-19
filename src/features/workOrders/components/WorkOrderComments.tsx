"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  MoreVertical,
  Trash2,
  MessageSquare,
  Loader2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkOrderComments,
  createWorkOrderComment,
  deleteWorkOrderComment,
  Comment,
} from "../api/workOrderComments";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";
import { formatDateTime } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface WorkOrderCommentsProps {
  workOrderId: string;
}

export function WorkOrderComments({ workOrderId }: WorkOrderCommentsProps) {
  const t = useTranslations("workOrders");
  const tc = useTranslations("common");
  const tt = useTranslations("toasts");
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["workOrderComments", workOrderId],
    queryFn: () => getWorkOrderComments(workOrderId),
    enabled: !!workOrderId,
  });

  const createMutation = useMutation({
    mutationFn: (content: string) => createWorkOrderComment(workOrderId, { content }),
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["workOrderComments", workOrderId] });
      const previousComments = queryClient.getQueryData<Comment[]>(["workOrderComments", workOrderId]);

      if (user) {
        const optimisticComment: Comment = {
          id: Math.random().toString(),
          work_order_id: workOrderId,
          user_id: user.id,
          content: newComment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
          },
        };

        queryClient.setQueryData<Comment[]>(["workOrderComments", workOrderId], (old = []) => [
          optimisticComment,
          ...old,
        ]);
      }

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(["workOrderComments", workOrderId], context?.previousComments);
      toast.error(tt("error.commentPostFailed"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderComments", workOrderId] });
    },
    onSuccess: () => {
      setCommentText("");
      toast.success(tt("success.commentPosted"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteWorkOrderComment(workOrderId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderComments", workOrderId] });
      toast.success(tt("success.commentDeleted"));
    },
    onError: () => {
      toast.error(tt("error.deleteCommentFailed"));
    },
  });

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    createMutation.mutate(commentText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDelete = (commentId: string) => {
    if (confirm(tc("confirmDelete", { item: t("comments.item") }))) {
      deleteMutation.mutate(commentId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Input Card */}
      <Card className="border-none shadow-sm bg-white dark:bg-gray-950 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-800">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=random`} />
              <AvatarFallback>{user ? getInitials(`${user.first_name} ${user.last_name}`) : "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder={t("comments.placeholder")}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[80px] resize-none border-gray-200 dark:border-gray-800 focus-visible:ring-blue-500 bg-gray-50 dark:bg-gray-900/50"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!commentText.trim() || createMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {t("comments.post")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
          <MessageSquare className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("comments.title", { count: comments.length })}
          </h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("comments.empty.title")}</p>
            <p className="text-xs text-gray-400 mt-1">{t("comments.empty.description")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-sm bg-white dark:bg-gray-950">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-800">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${comment.user?.first_name}+${comment.user?.last_name}&background=random`} />
                          <AvatarFallback>
                            {comment.user
                              ? getInitials(`${comment.user.first_name} ${comment.user.last_name}`)
                              : <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                  {comment.user ? `${comment.user.first_name} ${comment.user.last_name}` : t("comments.unknownUser")}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  • {formatDateTime(comment.created_at)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {comment.user?.role || t("comments.roleFallback")}
                              </p>
                            </div>

                            {user?.id === comment.user_id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {/* <DropdownMenuItem>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem> */}
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => handleDelete(comment.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {tc("delete")}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>

                          <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
