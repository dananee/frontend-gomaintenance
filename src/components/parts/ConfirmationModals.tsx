'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ApprovalConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    partName: string;
    quantity: number;
}

export function ApprovalConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    partName,
    quantity,
}: ApprovalConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-gray-200 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
                        Approve Part Request
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        This will create a purchase order in Odoo
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                        <p className="text-sm text-green-900">
                            <strong>Part:</strong> {partName}
                        </p>
                        <p className="text-sm text-green-900 mt-1">
                            <strong>Quantity:</strong> {quantity}
                        </p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Approving this request will automatically create a purchase order in Odoo and notify the requester.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Approving...
                                </>
                            ) : (
                                'Confirm Approval'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface RejectionConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading: boolean;
    partName: string;
}

export function RejectionConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    partName,
}: RejectionConfirmationModalProps) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason);
            setReason('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-gray-200 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                        <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                        Reject Part Request
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Please provide a reason for rejection
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-900">
                            <strong>Part:</strong> {partName}
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="reason" className="text-sm font-semibold text-gray-700">
                            Rejection Reason
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Explain why this request is being rejected..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            required
                            className="mt-2 bg-white/50 border-gray-300 focus:border-red-500 focus:ring-red-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!reason.trim() || isLoading}
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Rejecting...
                                </>
                            ) : (
                                'Confirm Rejection'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
