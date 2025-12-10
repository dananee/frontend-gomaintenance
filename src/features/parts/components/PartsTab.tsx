'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestPartModal } from './RequestPartModal';
import { PartRequestsTable } from './PartRequestsTable';
import { getPartRequests } from '@/api/parts';
import { WorkOrderPartRequest } from '@/types/parts';
import { Plus, Package } from 'lucide-react';

interface PartsTabProps {
    workOrderId: string;
}

export function PartsTab({ workOrderId }: PartsTabProps) {
    const [requests, setRequests] = useState<WorkOrderPartRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    const loadRequests = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getPartRequests(workOrderId);
            setRequests(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [workOrderId]);

    const handleRequestSuccess = () => {
        loadRequests();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Package className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Parts Requests</h2>
                        <p className="text-sm text-gray-500">
                            Request and track parts for this work order
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Request Part
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <p className="text-sm text-red-600">{error}</p>
                    </CardContent>
                </Card>
            )}

            {/* Requests Table */}
            {requests.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No parts requested</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Get started by requesting a part for this work order.
                            </p>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Request Part
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <PartRequestsTable
                    requests={requests}
                    onUpdate={loadRequests}
                />
            )}

            {/* Request Part Modal */}
            <RequestPartModal
                workOrderId={workOrderId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleRequestSuccess}
            />
        </div>
    );
}
