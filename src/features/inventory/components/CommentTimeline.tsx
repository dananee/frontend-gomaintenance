import { format } from "date-fns";
import { User, Clock, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PartComment } from "../types/inventory.types";

interface CommentTimelineProps {
  comments: PartComment[];
}

export function CommentTimeline({ comments }: CommentTimelineProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
        <div className="flex justify-center mb-2">
           <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <p>No comments yet.</p>
        <p className="text-sm">Start a discussion or log an activity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4 group">
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.user?.first_name} ${comment.user?.last_name}`} />
            <AvatarFallback>{comment.user?.first_name?.[0]}{comment.user?.last_name?.[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">
                  {comment.user?.first_name} {comment.user?.last_name}
                </span>
                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal text-muted-foreground">
                    {/* Role placeholder - assumes generic User for now until role is available */}
                    Member
                </Badge>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {format(new Date(comment.created_at), "MMM d, yyyy HH:mm")}
              </div>
            </div>
            
            <div className="text-sm text-foreground/90 bg-muted/40 p-3 rounded-lg rounded-tl-none border">
              {comment.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
