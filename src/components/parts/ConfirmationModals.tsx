'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
    const t = useTranslations('partRequests.confirmation');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-gray-200 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
                        {t('approveModal.title')}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        {t('approveModal.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                        <p className="text-sm text-green-900">
                            <strong>{t('fields.part')}:</strong> {partName}
                        </p>
                        <p className="text-sm text-green-900 mt-1">
                            <strong>{t('fields.quantity')}:</strong> {quantity}
                        </p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-800">
                            <strong>{t('fields.note')}:</strong> {t('approveModal.note')}
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            {t('actions.cancel')}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {t('actions.approving')}
                                </>
                            ) : (
                                t('actions.confirmApproval')
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
    const t = useTranslations('partRequests.confirmation');

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
                        {t('rejectModal.title')}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        {t('rejectModal.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-900">
                            <strong>{t('fields.part')}:</strong> {partName}
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="reason" className="text-sm font-semibold text-gray-700">
                            {t('fields.rejectionReason')}
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder={t('rejectModal.placeholder')}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            required
                            className="mt-2 bg-white/50 border-gray-300 focus:border-red-500 focus:ring-red-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            {t('actions.cancel')}
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!reason.trim() || isLoading}
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {t('actions.rejecting')}
                                </>
                            ) : (
                                t('actions.confirmRejection')
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
