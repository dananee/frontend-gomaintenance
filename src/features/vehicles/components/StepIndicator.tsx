import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
    step: number;
    current: number;
    label: string;
}

export function StepIndicator({ step, current, label }: StepIndicatorProps) {
    const isCompleted = current > step;
    const isActive = current === step;

    return (
        <div className="flex items-center gap-2">
            <div
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted && "border-[#165FF2] bg-[#165FF2] text-white",
                    isActive && "border-[#165FF2] bg-white text-[#165FF2]",
                    !isCompleted && !isActive && "border-gray-300 bg-white text-gray-400"
                )}
            >
                {isCompleted ? (
                    <Check className="h-4 w-4" />
                ) : (
                    <span className="text-sm font-semibold">{step}</span>
                )}
            </div>
            <span
                className={cn(
                    "text-sm font-medium",
                    isActive && "text-[#165FF2]",
                    !isActive && "text-gray-500"
                )}
            >
                {label}
            </span>
            {step < 3 && (
                <div
                    className={cn(
                        "h-0.5 w-12 transition-colors",
                        current > step ? "bg-[#165FF2]" : "bg-gray-300"
                    )}
                />
            )}
        </div>
    );
}
