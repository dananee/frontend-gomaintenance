'use client';

import { WorkOrderPartRequest } from '@/types/parts';
import { CheckCircle2, Clock, Package, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';

interface EnhancedStatusTimelineProps {
    request: WorkOrderPartRequest;
}

export function EnhancedStatusTimeline({ request }: EnhancedStatusTimelineProps) {
    const t = useTranslations('partRequests.premium.timeline');
    const steps = [
        {
            name: t('steps.requested'),
            timestamp: request.created_at,
            completed: true,
            icon: Clock,
            color: 'blue',
        },
        {
            name: t('steps.approved'),
            timestamp: request.approved_at,
            completed: !!request.approved_at,
            icon: CheckCircle2,
            color: 'green',
        },
        {
            name: t('steps.poCreated'),
            timestamp: request.ordered_at,
            completed: !!request.ordered_at,
            icon: Package,
            color: 'purple',
        },
        {
            name: t('steps.received'),
            timestamp: request.received_at,
            completed: !!request.received_at,
            icon: CheckCircle2,
            color: 'emerald',
        },
    ];

    // Handle rejected/cancelled states
    if (request.status === 'REJECTED') {
        return (
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 border-2 border-red-500">
                    <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                    <span className="text-sm font-semibold text-red-900">{t('statuses.rejected')}</span>
                    {request.rejection_reason && (
                        <p className="text-xs text-red-700 mt-1">{request.rejection_reason}</p>
                    )}
                </div>
            </div>
        );
    }

    if (request.status === 'CANCELLED') {
        return (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 border-2 border-gray-400">
                    <AlertCircle className="h-6 w-6 text-gray-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">{t('statuses.cancelled')}</span>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="flex items-center justify-between">
                {steps.map((step, stepIdx) => {
                    const Icon = step.icon;
                    const isLast = stepIdx === steps.length - 1;

                    return (
                        <div key={step.name} className="relative flex flex-col items-center flex-1">
                            {/* Connector Line */}
                            {!isLast && (
                                <div className="absolute top-5 left-1/2 w-full h-0.5 -z-10">
                                    <motion.div
                                        className={`h-full ${step.completed ? 'bg-gradient-to-r from-indigo-500 to-indigo-300' : 'bg-gray-200'
                                            }`}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: step.completed ? 1 : 0 }}
                                        transition={{ duration: 0.5, delay: stepIdx * 0.1 }}
                                    />
                                </div>
                            )}

                            {/* Step Circle */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: stepIdx * 0.1 }}
                                className="relative z-10"
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${step.completed
                                            ? `bg-${step.color}-100 border-${step.color}-500 shadow-lg shadow-${step.color}-200`
                                            : 'bg-white border-gray-300'
                                        }`}
                                >
                                    <Icon
                                        className={`h-5 w-5 ${step.completed ? `text-${step.color}-600` : 'text-gray-400'
                                            }`}
                                    />
                                </div>
                            </motion.div>

                            {/* Step Label */}
                            <div className="mt-3 text-center">
                                <p
                                    className={`text-xs font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'
                                        }`}
                                >
                                    {step.name}
                                </p>
                                {step.timestamp && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDistanceToNow(new Date(step.timestamp), { addSuffix: true })}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
