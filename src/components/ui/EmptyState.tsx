import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center dark:border-gray-800 dark:bg-gray-900/50",
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="h-9">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
