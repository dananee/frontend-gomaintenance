"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("GlobalErrorBoundary caught an error", error, errorInfo);
    // Send error to Sentry
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import("@sentry/react").then((Sentry) => {
        Sentry.captureException(error, { extra: errorInfo as any });
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
          <div className="flex max-w-md flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Something went wrong
            </h2>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              {this.state.message || "An unexpected error occurred. Please try again."}
            </p>
            <div className="flex gap-4">
              <Button onClick={() => window.location.reload()} variant="outline">
                Reload
              </Button>
              <Button onClick={this.handleReset}>Try Again</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
