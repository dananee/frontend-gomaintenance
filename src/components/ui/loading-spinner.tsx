import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
        xl: "h-16 w-16 border-4",
    };

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <div
                className={cn(
                    "animate-spin rounded-full border-solid border-primary border-t-transparent",
                    sizeClasses[size]
                )}
            />
            {/* Subtle outer glow effect for premium feel */}
            <div
                className={cn(
                    "absolute animate-pulse rounded-full bg-primary/10 blur-xl",
                    size === "sm" ? "h-6 w-6" : size === "md" ? "h-12 w-12" : size === "lg" ? "h-20 w-20" : "h-24 w-24"
                )}
            />
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="animate-pulse text-sm font-medium text-gray-500 dark:text-gray-400">
                Chargement en cours...
            </p>
        </div>
    );
}
