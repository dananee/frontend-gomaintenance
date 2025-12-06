'use client';

import { useState } from 'react';
import { WorkOrderPartRequest, PartRequestStatus } from '@/types/parts';
import { StatusBadge, StatusTimeline } from './StatusTimeline';
import { AttachmentsViewer } from './AttachmentsViewer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronRight, Calendar, User, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PartRequestsTableProps {
    requests: WorkOrderPartRequest[];
    onUpdate: () => void;
}

export function PartRequestsTable({ requests, onUpdate }: PartRequestsTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    return (
        <div className="space-y-3">
            {requests.map((request) => {
                const isExpanded = expandedRows.has(request.id);

                return (
                    <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        {/* Main Row */}
                        <div
                            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleRow(request.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    {/* Expand Icon */}
                                    <button className="text-gray-400 hover:text-gray-600">
                                        {isExpanded ? (
                                            <ChevronDown className="h-5 w-5" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5" />
                                        )}
                                    </button>

                                    {/* Part Info */}
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                            <Package className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {request.part?.name || 'Unknown Part'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                SKU: {request.part?.part_number || 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="px-3 py-1 bg-gray-100 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700">
                                            Qty: {request.quantity}
                                        </span>
                                    </div>

                                    {/* Status Badge */}
                                    <StatusBadge status={request.status} />

                                    {/* Requested Date */}
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                    </div>

                                    {/* Requested By */}
                                    <div className="flex items-center text-sm text-gray-500">
                                        <User className="h-4 w-4 mr-1" />
                                        {request.requested_by?.first_name} {request.requested_by?.last_name}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                            <div className="border-t bg-gray-50 p-6 space-y-6">
                                {/* Status Timeline */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Status Timeline</h4>
                                    <div className="bg-white p-6 rounded-lg border">
                                        <StatusTimeline request={request} />
                                    </div>
                                </div>

                                {/* Notes */}
                                {request.notes && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                                        <div className="bg-white p-4 rounded-lg border text-sm text-gray-600">
                                            {request.notes}
                                        </div>
                                    </div>
                                )}

                                {/* Rejection Reason */}
                                {request.rejection_reason && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-red-700 mb-2">Rejection Reason</h4>
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-sm text-red-600">
                                            {request.rejection_reason}
                                        </div>
                                    </div>
                                )}

                                {/* Purchase Order Info */}
                                {request.odoo_purchase_order_id && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Purchase Order</h4>
                                        <div className="bg-white p-4 rounded-lg border">
                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <span className="text-sm text-gray-500">PO Number:</span>
                                                    <span className="ml-2 font-mono text-sm font-semibold text-gray-900">
                                                        #{request.odoo_purchase_order_id}
                                                    </span>
                                                </div>
                                                {request.approved_by && (
                                                    <div>
                                                        <span className="text-sm text-gray-500">Approved by:</span>
                                                        <span className="ml-2 text-sm font-medium text-gray-900">
                                                            {request.approved_by.first_name} {request.approved_by.last_name}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Attachments */}
                                {request.attachments && request.attachments.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
                                        <AttachmentsViewer attachments={request.attachments} />
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
