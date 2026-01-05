'use client';

import { useState } from 'react';
import { usePartRequests } from '@/hooks/queries/usePartsQueries';
import { PremiumRequestPartModal } from './PremiumRequestPartModal';
import { PremiumPartRequestsTable } from './PremiumPartRequestsTable';
import { ConsumePartsModal } from './ConsumePartsModal';
import { PartRequestsSkeleton } from './SkeletonLoaders';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Package, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { WorkOrderPartRequest } from '@/types/parts';
import { useTranslations } from 'next-intl';

const MotionDiv = motion.div as any;

interface PremiumPartsTabProps {
    workOrderId: string;
}

export function PremiumPartsTab({ workOrderId }: PremiumPartsTabProps) {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [consumeRequest, setConsumeRequest] = useState<WorkOrderPartRequest | null>(null);
    const t = useTranslations('partRequests.premium.tab');

    const { data: requests, isLoading, error } = usePartRequests(workOrderId);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <PartRequestsSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                    <p className="text-sm text-red-600">{t('error')}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <MotionDiv
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl border border-indigo-200 shadow-lg">
                        <Package className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {t('title')}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    {t('actions.requestPart')}
                    <Sparkles className="h-4 w-4 ml-2" />
                </Button>
            </MotionDiv>

            {/* Requests Table or Empty State */}
            {!requests || requests.length === 0 ? (
                <MotionDiv
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white">
                        <CardContent className="py-16">
                            <div className="text-center">
                                <div className="inline-flex p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl mb-6">
                                    <Package className="h-16 w-16 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('empty.title')}</h3>
                                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                    {t('empty.description')}
                                </p>
                                <Button
                                    onClick={() => setIsRequestModalOpen(true)}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    {t('empty.cta')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </MotionDiv>
            ) : (
                <PremiumPartRequestsTable
                    requests={requests}
                    onMarkUsed={(request) => setConsumeRequest(request)}
                />
            )}

            {/* Modals */}
            <PremiumRequestPartModal
                workOrderId={workOrderId}
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />

            <ConsumePartsModal
                workOrderId={workOrderId}
                request={consumeRequest}
                isOpen={!!consumeRequest}
                onClose={() => setConsumeRequest(null)}
            />
        </div>
    );
}
