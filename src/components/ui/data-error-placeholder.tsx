import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface DataErrorPlaceholderProps {
    message?: string;
    onRetry?: () => void;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function DataErrorPlaceholder({
    message = "Failed to load data",
    onRetry,
    size = "md",
    className,
}: DataErrorPlaceholderProps) {
    const sizeClasses = {
        sm: "py-4 gap-2",
        md: "py-8 gap-3",
        lg: "py-12 gap-4",
    };

    const iconSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    const textSizes = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center",
                sizeClasses[size],
                className
            )}
        >
            <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className={cn(iconSizes[size], "text-amber-500")} />
                <p className={cn(textSizes[size], "font-medium")}>{message}</p>
            </div>
            {onRetry && (
                <Button
                    variant="outline"
                    size={size === "sm" ? "sm" : "lg"}
                    onClick={onRetry}
                    className="mt-2"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                </Button>
            )}
        </div>
    );
}
