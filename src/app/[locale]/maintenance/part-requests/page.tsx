'use client';

import { useState } from 'react';
import { usePendingApprovals, useApprovePartRequest, useRejectPartRequest } from '@/hooks/queries/usePartsQueries';
import { ApprovalConfirmationModal, RejectionConfirmationModal } from '@/components/parts/ConfirmationModals';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Package, AlertCircle, Check, X, ClipboardCheck, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { getStatusColor, getStatusDisplayName } from '@/types/parts';
import type { WorkOrderPartRequest } from '@/types/parts';
import { useTranslations } from 'next-intl';

export default function SupervisorApprovalPage() {
    const t = useTranslations('partRequests.approvals');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<WorkOrderPartRequest | null>(null);
    const [approvalModalOpen, setApprovalModalOpen] = useState(false);
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);

    const { data, isLoading, error } = usePendingApprovals(page, 20);
    const approveMutation = useApprovePartRequest();
    const rejectMutation = useRejectPartRequest();
    const { showSuccess, showError } = useToast();

    const handleApprove = async () => {
        if (!selectedRequest) return;

        try {
            await approveMutation.mutateAsync(selectedRequest.id);
            showSuccess(t('notifications.approveSuccess'));
            setApprovalModalOpen(false);
            setSelectedRequest(null);
        } catch (err: any) {
            showError(err.message || t('notifications.approveError'));
        }
    };

    const handleReject = async (reason: string) => {
        if (!selectedRequest) return;

        try {
            await rejectMutation.mutateAsync({
                requestId: selectedRequest.id,
                payload: { reason },
            });
            showSuccess(t('notifications.rejectSuccess'));
            setRejectionModalOpen(false);
            setSelectedRequest(null);
        } catch (err: any) {
            showError(err.message || t('notifications.rejectError'));
        }
    };

    const filteredRequests = data?.data.filter((req) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            req.part?.name.toLowerCase().includes(query) ||
            req.part?.part_number.toLowerCase().includes(query) ||
            req.work_order_id.toLowerCase().includes(query)
        );
    });

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center space-x-4 mb-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl border border-indigo-200 shadow-xl">
                        <ClipboardCheck className="h-10 w-10 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {t('title')}
                        </h1>
                        <p className="text-gray-500 mt-1">{t('subtitle')}</p>
                    </div>
                </div>
            </motion.div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="mb-6 border-gray-200 shadow-lg">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Error */}
            {error && (
                <Card className="mb-6 border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            <span>{t('error')}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="inline-flex p-4 bg-indigo-50 rounded-full mb-4">
                            <Package className="h-12 w-12 text-indigo-600 animate-pulse" />
                        </div>
                        <p className="text-gray-600">{t('loading')}</p>
                    </div>
                </div>
            ) : !filteredRequests || filteredRequests.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white">
                        <CardContent className="py-16">
                            <div className="text-center">
                                <div className="inline-flex p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl mb-6">
                                    <ClipboardCheck className="h-16 w-16 text-green-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('empty.title')}</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    {t('empty.description')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredRequests.map((request, index) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 border-gray-200 bg-white/80 backdrop-blur-sm">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 space-y-4">
                                                {/* Part Info */}
                                                <div className="flex items-center space-x-4">
                                                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                                                    <Package className="h-8 w-8 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {request.part?.name || t('fallback.unknownPart')}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {t('fields.sku')}: {request.part?.part_number || t('fallback.na')} • {t('fields.quantity')}: {request.quantity}
                                                    </p>
                                                </div>
                                            </div>

                                                {/* Request Details */}
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div className="p-3 bg-gray-50 rounded-lg">
                                                        <span className="text-gray-500 block mb-1">{t('fields.workOrder')}</span>
                                                        <span className="font-mono font-semibold text-gray-900">
                                                            {request.work_order_id.slice(0, 8)}...
                                                        </span>
                                                    </div>
                                                    <div className="p-3 bg-gray-50 rounded-lg">
                                                        <span className="text-gray-500 block mb-1">{t('fields.requestedBy')}</span>
                                                        <span className="font-semibold text-gray-900">
                                                            {request.requested_by?.first_name} {request.requested_by?.last_name}
                                                        </span>
                                                    </div>
                                                    <div className="p-3 bg-gray-50 rounded-lg">
                                                        <span className="text-gray-500 block mb-1">{t('fields.requested')}</span>
                                                        <span className="text-gray-900">
                                                            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                {request.notes && (
                                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                                        <p className="text-sm text-blue-900">
                                                            <strong>{t('fields.notes')}:</strong> {request.notes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col space-y-3 ml-6">
                                                <Button
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setApprovalModalOpen(true);
                                                    }}
                                                    disabled={approveMutation.isPending || rejectMutation.isPending}
                                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    {t('actions.approve')}
                                                    <Sparkles className="h-3 w-3 ml-2" />
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setRejectionModalOpen(true);
                                                    }}
                                                    disabled={approveMutation.isPending || rejectMutation.isPending}
                                                    variant="outline"
                                                    className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    {t('actions.reject')}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Pagination */}
            {data && data.total > 20 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex items-center justify-center space-x-3"
                >
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="border-gray-300"
                    >
                        {t('actions.previous')}
                    </Button>
                    <span className="text-sm text-gray-600 px-4">
                        {t('pagination', { page, total: Math.ceil(data.total / 20) })}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= Math.ceil(data.total / 20)}
                        className="border-gray-300"
                    >
                        {t('actions.next')}
                    </Button>
                </motion.div>
            )}

            {/* Confirmation Modals */}
            {selectedRequest && (
                <>
                    <ApprovalConfirmationModal
                        isOpen={approvalModalOpen}
                        onClose={() => {
                            setApprovalModalOpen(false);
                            setSelectedRequest(null);
                        }}
                        onConfirm={handleApprove}
                        isLoading={approveMutation.isPending}
                        partName={selectedRequest.part?.name || t('fallback.unknownPart')}
                        quantity={selectedRequest.quantity}
                    />

                    <RejectionConfirmationModal
                        isOpen={rejectionModalOpen}
                        onClose={() => {
                            setRejectionModalOpen(false);
                            setSelectedRequest(null);
                        }}
                        onConfirm={handleReject}
                        isLoading={rejectMutation.isPending}
                        partName={selectedRequest.part?.name || t('fallback.unknownPart')}
                    />
                </>
            )}
        </div>
    );
}
