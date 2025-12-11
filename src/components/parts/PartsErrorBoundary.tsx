'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

interface PartsErrorBoundaryContentProps extends Props {
    t: (key: string) => string;
}

class PartsErrorBoundaryInner extends React.Component<PartsErrorBoundaryContentProps, State> {
    constructor(props: PartsErrorBoundaryContentProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Parts Integration Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
                    <CardContent className="py-12">
                        <div className="text-center max-w-md mx-auto">
                            <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
                                <AlertCircle className="h-12 w-12 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-red-900 mb-2">
                                {this.props.t('title')}
                            </h3>
                            <p className="text-red-700 mb-6">
                                {this.state.error?.message || this.props.t('description')}
                            </p>
                            <Button
                                onClick={() => this.setState({ hasError: false, error: null })}
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                {this.props.t('actions.retry')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}

export function PartsErrorBoundary(props: Props) {
    const t = useTranslations('partRequests.premium.errorBoundary');

    return <PartsErrorBoundaryInner {...props} t={t} />;
}
