'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WorkOrderPartRequest } from '@/types/parts';
import { useConsumeParts } from '@/hooks/queries/usePartsQueries';
import { useToast } from '@/hooks/useToast';
import { Package, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConsumePartsModalProps {
    workOrderId: string;
    request: WorkOrderPartRequest | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ConsumePartsModal({ workOrderId, request, isOpen, onClose }: ConsumePartsModalProps) {
    const [quantityUsed, setQuantityUsed] = useState('');
    const consumeMutation = useConsumeParts(workOrderId);
    const { showSuccess, showError } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!request || !quantityUsed) return;

        const qty = parseFloat(quantityUsed);
        if (qty > request.quantity) {
            showError(`Quantity used cannot exceed approved quantity (${request.quantity})`);
            return;
        }

        try {
            await consumeMutation.mutateAsync({
                consumptions: [
                    {
                        part_request_id: request.id,
                        quantity_used: qty,
                    },
                ],
            });
            showSuccess('Parts consumption recorded successfully');
            handleClose();
        } catch (err: any) {
            showError(err.message || 'Failed to record parts consumption');
        }
    };

    const handleClose = () => {
        setQuantityUsed('');
        onClose();
    };

    if (!request) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-gray-200 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Mark Parts as Used
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Part Info */}
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <Package className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <div className="font-semibold text-green-900">{request.part?.name}</div>
                                <div className="text-sm text-green-700">
                                    SKU: {request.part?.part_number} • Approved: {request.quantity}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Used */}
                    <div>
                        <Label htmlFor="quantityUsed" className="text-sm font-semibold text-gray-700">
                            Quantity Used
                        </Label>
                        <Input
                            id="quantityUsed"
                            type="number"
                            min="0.01"
                            max={request.quantity}
                            step="0.01"
                            placeholder={`Enter quantity (max: ${request.quantity})`}
                            value={quantityUsed}
                            onChange={(e) => setQuantityUsed(e.target.value)}
                            required
                            className="mt-2 bg-white/50 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                        {quantityUsed && parseFloat(quantityUsed) > request.quantity && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 flex items-center space-x-2 text-red-600 text-sm"
                            >
                                <AlertCircle className="h-4 w-4" />
                                <span>Quantity exceeds approved amount</span>
                            </motion.div>
                        )}
                    </div>

                    {/* Info Message */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Recording parts consumption will update stock levels in Odoo and mark this request as consumed.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!quantityUsed || parseFloat(quantityUsed) > request.quantity || consumeMutation.isPending}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                        >
                            {consumeMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Recording...
                                </>
                            ) : (
                                'Confirm Usage'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
