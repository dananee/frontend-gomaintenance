import ReactGA from "react-ga4";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const useAnalytics = () => {
  const trackEvent = (category: string, action: string, label?: string) => {
    if (typeof window !== "undefined" && window.gtag) {
        ReactGA.event({
            category,
            action,
            label,
        });
    }
  };

  return { trackEvent };
};
