"use client";

import NumberFlow, { type NumberFlowProps } from "@number-flow/react";

interface AnimatedNumberProps extends Omit<NumberFlowProps, "value"> {
    value: number;
    className?: string;
    currency?: string;
    suffix?: string;
    prefix?: string;
    decimals?: number;
}

export function AnimatedNumber({
    value,
    className,
    currency,
    suffix,
    prefix,
    decimals,
    format,
    ...props
}: AnimatedNumberProps) {
    const formatOptions: Intl.NumberFormatOptions = {
        ...format,
        ...(currency
            ? {
                style: "currency",
                currency: currency,
                minimumFractionDigits: decimals ?? 2,
                maximumFractionDigits: decimals ?? 2,
            }
            : {
                minimumFractionDigits: decimals ?? 0,
                maximumFractionDigits: decimals ?? (decimals !== undefined ? decimals : 2),
            }),
    };

    return (
        <NumberFlow
            value={value}
            className={className}
            format={formatOptions as any}
            suffix={suffix}
            prefix={prefix}
            {...props}
        />
    );
}
