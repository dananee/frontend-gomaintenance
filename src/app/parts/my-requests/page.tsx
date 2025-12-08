'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getMyRequests } from '@/api/parts';
import { WorkOrderPartRequest } from '@/types/parts';
import { StatusBadge } from '@/features/parts/components/StatusTimeline';
import { Search, Package, Calendar, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function RequestHistoryPage() {
    const [requests, setRequests] = useState<WorkOrderPartRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const response = await getMyRequests(page, 20);
            setRequests(response.data);
            setTotal(response.total);
        } catch (err) {
            console.error('Failed to load requests:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [page]);

    const filteredRequests = requests.filter((req) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            req.part?.name.toLowerCase().includes(query) ||
            req.part?.part_number.toLowerCase().includes(query) ||
            req.status.toLowerCase().includes(query)
        );
    });

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                        <FileText className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Part Requests</h1>
                        <p className="text-gray-500">View your part request history</p>
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
                            placeholder="Search by part name, SKU, or status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

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
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No requests found</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                You haven't requested any parts yet.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((request) => (
                        <Card key={request.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-3">
                                        {/* Part Info */}
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-indigo-50 rounded-lg">
                                                <Package className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {request.part?.name || 'Unknown Part'}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    SKU: {request.part?.part_number || 'N/A'} • Qty: {request.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Request Details */}
                                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                            </div>
                                            {request.approved_by && (
                                                <div>
                                                    Approved by: {request.approved_by.first_name} {request.approved_by.last_name}
                                                </div>
                                            )}
                                        </div>

                                        {/* Notes */}
                                        {request.notes && (
                                            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                                                {request.notes}
                                            </div>
                                        )}

                                        {/* Rejection Reason */}
                                        {request.rejection_reason && (
                                            <div className="p-3 bg-red-50 rounded-lg text-sm text-red-600">
                                                <strong>Rejected:</strong> {request.rejection_reason}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Badge */}
                                    <StatusBadge status={request.status} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {total > 20 && (
                <div className="mt-6 flex items-center justify-center space-x-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {Math.ceil(total / 20)}
                    </span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= Math.ceil(total / 20)}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
