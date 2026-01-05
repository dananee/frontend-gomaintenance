'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSearchParts, useCreatePartRequest } from '@/hooks/queries/usePartsQueries';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import { Search, Package, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Part } from '@/types/parts';
import { useTranslations } from 'next-intl';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

interface PremiumRequestPartModalProps {
    workOrderId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function PremiumRequestPartModal({ workOrderId, isOpen, onClose }: PremiumRequestPartModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');

    const debouncedSearch = useDebounce(searchQuery, 300);
    const { data: searchResults, isLoading: isSearching } = useSearchParts(debouncedSearch);
    const createMutation = useCreatePartRequest(workOrderId);
    const { showSuccess, showError } = useToast();
    const t = useTranslations('partRequests.premium.requestModal');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPart || !quantity) return;

        try {
            await createMutation.mutateAsync({
                part_id: selectedPart.id,
                quantity: parseFloat(quantity),
                notes,
            });
            showSuccess(t('alerts.createSuccess'));
            handleClose();
        } catch (err: any) {
            showError(err.message || t('alerts.createError'));
        }
    };

    const handleClose = () => {
        setSearchQuery('');
        setSelectedPart(null);
        setQuantity('');
        setNotes('');
        onClose();
    };

    const getStockBadge = (part: Part) => {
        if (part.quantity > part.min_quantity) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {t('stock.inStock', { quantity: part.quantity })}
                </span>
            );
        } else if (part.quantity > 0) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {t('stock.lowStock', { quantity: part.quantity })}
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {t('stock.outOfStock')}
                </span>
            );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-xl border-gray-200 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {t('title')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Search Parts */}
                    <div>
                        <Label htmlFor="search" className="text-sm font-semibold text-gray-700">
                            {t('fields.search')}
                        </Label>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                id="search"
                                type="text"
                                placeholder={t('placeholders.search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 animate-spin" />
                            )}
                        </div>

                        {/* Search Results */}
                        <AnimatePresence>
                            {searchResults && searchResults.data.length > 0 && (
                                <MotionDiv
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-3 max-h-80 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white shadow-lg"
                                >
                                    {searchResults.data.map((part) => (
                                        <MotionButton
                                            key={part.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedPart(part);
                                                setSearchQuery('');
                                            }}
                                            whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                                            className="w-full px-4 py-4 text-left transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                                        <Package className="h-5 w-5 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{part.name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {t('fields.sku')}: {part.part_number} {part.brand && `• ${part.brand}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                {getStockBadge(part)}
                                            </div>
                                        </MotionButton>
                                    ))}
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Selected Part */}
                    <AnimatePresence>
                        {selectedPart && (
                            <MotionDiv
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Package className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-indigo-900">{selectedPart.name}</div>
                                            <div className="text-sm text-indigo-700">{t('fields.sku')}: {selectedPart.part_number}</div>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedPart(null)}
                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-white/50"
                                    >
                                        {t('actions.change')}
                                    </Button>
                                </div>
                            </MotionDiv>
                        )}
                    </AnimatePresence>

                    {/* Quantity */}
                    <div>
                        <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700">
                            {t('fields.quantity')}
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder={t('placeholders.quantity')}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            className="mt-2 bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                            {t('fields.notes')}
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder={t('placeholders.notes')}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="mt-2 bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            {t('actions.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={!selectedPart || !quantity || createMutation.isPending}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                        >
                            {createMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {t('actions.requesting')}
                                </>
                            ) : (
                                t('actions.requestPart')
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
