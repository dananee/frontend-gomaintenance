'use client';

import { useState } from 'react';
import { PartRequestStatus, WorkOrderPartRequest } from '@/types/parts';
import { EnhancedStatusTimeline } from './EnhancedStatusTimeline';
import { PremiumAttachmentsViewer } from './PremiumAttachmentsViewer';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, User, Package, FileText, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { getStatusColor } from '@/types/parts';
import { useTranslations } from 'next-intl';

interface PremiumPartRequestsTableProps {
    requests: WorkOrderPartRequest[];
    onMarkUsed?: (request: WorkOrderPartRequest) => void;
}

export function PremiumPartRequestsTable({ requests, onMarkUsed }: PremiumPartRequestsTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const t = useTranslations('partRequests.premium.table');

    const statusKeyMap: Record<PartRequestStatus, string> = {
        [PartRequestStatus.DRAFT]: 'draft',
        [PartRequestStatus.PENDING_APPROVAL]: 'pendingApproval',
        [PartRequestStatus.APPROVED]: 'approved',
        [PartRequestStatus.SENT_TO_ODOO]: 'sentToOdoo',
        [PartRequestStatus.ORDERED]: 'ordered',
        [PartRequestStatus.RECEIVED]: 'received',
        [PartRequestStatus.REJECTED]: 'rejected',
        [PartRequestStatus.CANCELLED]: 'cancelled',
    };

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const getStatusBadgeClasses = (status: string) => {
        const color = getStatusColor(status);
        return `inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${color}`;
    };

    return (
        <div className="space-y-3">
            {requests.map((request, index) => {
                const isExpanded = expandedRows.has(request.id);
                const canMarkUsed = request.status === 'RECEIVED' && onMarkUsed;

                return (
                    <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:shadow-xl hover:border-indigo-300 transition-all duration-300"
                    >
                        {/* Main Row */}
                        <div
                            className="p-5 cursor-pointer"
                            onClick={() => toggleRow(request.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    {/* Expand Icon */}
                                    <motion.button
                                        animate={{ rotate: isExpanded ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </motion.button>

                                    {/* Part Info */}
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                                            <Package className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-lg">
                                                {request.part?.name || t('fallback.unknownPart')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {t('labels.sku')}: {request.part?.part_number || t('fallback.na')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity Badge */}
                                    <div className="px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                                        <span className="text-sm font-semibold text-gray-700">
                                            {t('labels.quantity')}: {request.quantity}
                                        </span>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={getStatusBadgeClasses(request.status)}>
                                        {t(`statuses.${statusKeyMap[request.status] ?? 'unknown'}`)}
                                    </span>

                                    {/* Requested Date */}
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-4 w-4 mr-1.5" />
                                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                    </div>

                                    {/* Requested By */}
                                    <div className="flex items-center text-sm text-gray-500">
                                        <User className="h-4 w-4 mr-1.5" />
                                        {request.requested_by?.first_name} {request.requested_by?.last_name}
                                    </div>

                                    {/* Mark Used Button */}
                                    {canMarkUsed && (
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onMarkUsed(request);
                                            }}
                                            size="sm"
                                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                                        >
                                            <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                            {t('actions.markUsed')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                                >
                                    <div className="p-6 space-y-6">
                                        {/* Status Timeline */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                                                <FileText className="h-4 w-4 mr-2" />
                                                {t('sections.statusTimeline')}
                                            </h4>
                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                                <EnhancedStatusTimeline request={request} />
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {request.notes && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('sections.notes')}</h4>
                                                <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-600">
                                                    {request.notes}
                                                </div>
                                            </div>
                                        )}

                                        {/* Rejection Reason */}
                                        {request.rejection_reason && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-red-700 mb-2">{t('sections.rejectionReason')}</h4>
                                                <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-sm text-red-600">
                                                    {request.rejection_reason}
                                                </div>
                                            </div>
                                        )}

                                        {/* Purchase Order Info */}
                                        {request.odoo_purchase_order_id && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('sections.purchaseOrder')}</h4>
                                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                                                    <div className="flex items-center space-x-6">
                                                        <div>
                                                            <span className="text-sm text-indigo-600 font-medium">{t('labels.poNumber')}:</span>
                                                            <span className="ml-2 font-mono text-sm font-bold text-indigo-900">
                                                                #{request.odoo_purchase_order_id}
                                                            </span>
                                                        </div>
                                                        {request.approved_by && (
                                                            <div>
                                                                <span className="text-sm text-indigo-600 font-medium">{t('labels.approvedBy')}:</span>
                                                                <span className="ml-2 text-sm font-semibold text-indigo-900">
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
                                                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    {t('sections.invoiceAttachments')}
                                                </h4>
                                                <PremiumAttachmentsViewer attachments={request.attachments} />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}
