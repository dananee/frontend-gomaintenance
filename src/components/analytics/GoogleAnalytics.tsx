"use client";

import { useEffect } from "react";
import ReactGA from "react-ga4";
import { usePathname, useSearchParams } from "next/navigation";

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!gaId) return;

        ReactGA.initialize(gaId);
    }, [gaId]);

    useEffect(() => {
        if (!gaId) return;

        const url = pathname + searchParams.toString();
        ReactGA.send({ hitType: "pageview", page: url });
    }, [pathname, searchParams, gaId]);

    return null;
}
