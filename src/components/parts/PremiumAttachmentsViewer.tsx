'use client';

import { useState } from 'react';
import { OdooAttachment } from '@/types/parts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, X, Loader2 } from 'lucide-react';
import { formatBytes } from '@/lib/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

interface PremiumAttachmentsViewerProps {
    attachments: OdooAttachment[];
}

export function PremiumAttachmentsViewer({ attachments }: PremiumAttachmentsViewerProps) {
    const [selectedAttachment, setSelectedAttachment] = useState<OdooAttachment | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations('partRequests.premium.attachments');

    const handleDownload = (attachment: OdooAttachment) => {
        const link = document.createElement('a');
        link.href = attachment.storage_url;
        link.download = attachment.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleView = (attachment: OdooAttachment) => {
        setIsLoading(true);
        setError(null);
        setSelectedAttachment(attachment);
        // Simulate loading
        setTimeout(() => setIsLoading(false), 500);
    };

    return (
        <>
            <div className="space-y-3">
                <AnimatePresence>
                    {attachments.map((attachment, index) => (
                        <motion.div
                            key={attachment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:shadow-lg hover:border-indigo-300 transition-all duration-300">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200 group-hover:scale-110 transition-transform">
                                        <FileText className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {attachment.file_name}
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                                            <span className="inline-flex items-center">
                                                {attachment.file_size ? formatBytes(attachment.file_size) : t('meta.unknownSize')}
                                            </span>
                                            <span>•</span>
                                            <span>{format(new Date(attachment.created_at), 'MMM d, yyyy')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleView(attachment)}
                                        className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        {t('actions.view')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownload(attachment)}
                                        className="border-gray-200 text-gray-600 hover:bg-gray-50"
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        {t('actions.download')}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* PDF Viewer Modal */}
            <Dialog open={!!selectedAttachment} onOpenChange={() => setSelectedAttachment(null)}>
                <DialogContent className="max-w-6xl h-[85vh] bg-white/95 backdrop-blur-xl border-gray-200 shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                {selectedAttachment?.file_name}
                            </DialogTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedAttachment(null)}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
                                    <p className="text-gray-600">{t('viewer.loading')}</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center p-8">
                                    <div className="p-4 bg-red-50 rounded-full inline-block mb-4">
                                        <FileText className="h-12 w-12 text-red-600" />
                                    </div>
                                    <p className="text-red-600 font-semibold mb-2">{t('viewer.loadError')}</p>
                                    <p className="text-gray-600 text-sm">{error}</p>
                                </div>
                            </div>
                        ) : selectedAttachment ? (
                            <iframe
                                src={selectedAttachment.storage_url}
                                className="w-full h-full border-0"
                                title={selectedAttachment.file_name}
                                onError={() => setError(t('viewer.renderError'))}
                            />
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
