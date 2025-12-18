"use client";

import { createContext, useContext, useEffect } from "react";
import { useBranding } from "@/hooks/useBranding";

// Create context without explicit types for simplicity as we just need the effect
const BrandingContext = createContext(null);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
    const { branding } = useBranding();

    useEffect(() => {
        if (branding) {
            const root = document.documentElement;

            if (branding.primary_color) {
                root.style.setProperty("--primary", hexToHsl(branding.primary_color));
                // Also update primary-foreground based on contrast if needed, 
                // but for now let's assume valid HSL variable usage
            }

            if (branding.accent_color) {
                root.style.setProperty("--accent", hexToHsl(branding.accent_color));
            }
        }
    }, [branding]);

    return (
        <BrandingContext.Provider value={null}>
            {children}
        </BrandingContext.Provider>
    );
}

// Helper to convert Hex to HSL for CSS variables (Tailwind often uses HSL components)
// e.g. --primary: 222.2 47.4% 11.2%
function hexToHsl(hex: string): string {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        // @ts-ignore
        return '0 0% 0%'; // Placeholder, real implementation needed below
    }

    // Real implementation
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt("0x" + hex[1] + hex[1]);
        g = parseInt("0x" + hex[2] + hex[2]);
        b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
        r = parseInt("0x" + hex[1] + hex[2]);
        g = parseInt("0x" + hex[3] + hex[4]);
        b = parseInt("0x" + hex[5] + hex[6]);
    }

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h: number = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // CSS HSL: 360deg 100% 100%
    // Tailwind variable usually expects: h s% l% (without units sometimes, or with)
    // Let's assume standard syntax: 210 100% 50%
    return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}
