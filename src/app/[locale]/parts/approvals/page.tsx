'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getPendingApprovals, approvePartRequest, rejectPartRequest } from '@/api/parts';
import { WorkOrderPartRequest } from '@/types/parts';
import { Check, X, Search, Package, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';

export default function SupervisorApprovalPage() {
    const t = useTranslations('partRequests.approvals');
    const [requests, setRequests] = useState<WorkOrderPartRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadRequests = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await getPendingApprovals(page, 20);
            setRequests(response.data);
            setTotal(response.total);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [page]);

    const handleApprove = async (requestId: string) => {
        setProcessingId(requestId);
        try {
            await approvePartRequest(requestId);
            await loadRequests();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (requestId: string) => {
        const reason = prompt(t('prompts.rejectReason'));
        if (!reason) return;

        setProcessingId(requestId);
        try {
            await rejectPartRequest(requestId, { reason });
            await loadRequests();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    const filteredRequests = requests.filter((req) => {
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
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                        <Package className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                        <p className="text-gray-500">{t('subtitle')}</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Error */}
            {error && (
                <Card className="mb-6 border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error || t('error')}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : filteredRequests.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">{t('noPendingApprovals')}</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {t('allProcessed')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((request) => (
                        <Card key={request.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-4">
                                        {/* Part Info */}
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-indigo-50 rounded-lg">
                                                <Package className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                {request.part?.name || t('fallback.unknownPart')}
                                            </h3>
                                                <p className="text-sm text-gray-500">
                                                {t('fields.sku')}: {request.part?.part_number || t('fallback.na')} • {t('fields.quantity')}: {request.quantity}
                                            </p>
                                            </div>
                                        </div>

                                        {/* Request Details */}
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">{t('fields.workOrder')}:</span>
                                                <span className="ml-2 font-mono text-gray-900">
                                                    {request.work_order_id.slice(0, 8)}...
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">{t('fields.requestedBy')}:</span>
                                                <span className="ml-2 font-medium text-gray-900">
                                                    {request.requested_by?.first_name} {request.requested_by?.last_name}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">{t('fields.requested')}:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {request.notes && (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">{request.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col space-y-2 ml-6">
                                        <Button
                                            onClick={() => handleApprove(request.id)}
                                            disabled={processingId === request.id}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            {t('actions.approve')}
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(request.id)}
                                            disabled={processingId === request.id}
                                            variant="outline"
                                            className="border-red-300 text-red-600 hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            {t('actions.reject')}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {total > 20 && (
                <div className="mt-6 flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        {t('actions.previous')}
                    </Button>
                    <span className="text-sm text-gray-600">
                        {t('pagination', { page, total: Math.ceil(total / 20) })}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= Math.ceil(total / 20)}
                    >
                        {t('actions.next')}
                    </Button>
                </div>
            )}
        </div>
    );
}
