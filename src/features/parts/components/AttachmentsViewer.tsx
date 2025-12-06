'use client';

import { useState } from 'react';
import { OdooAttachment } from '@/types/parts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye } from 'lucide-react';
import { formatBytes } from '@/lib/formatters';

interface AttachmentsViewerProps {
    attachments: OdooAttachment[];
}

export function AttachmentsViewer({ attachments }: AttachmentsViewerProps) {
    const [selectedAttachment, setSelectedAttachment] = useState<OdooAttachment | null>(null);

    const handleDownload = (attachment: OdooAttachment) => {
        // Create a download link
        const link = document.createElement('a');
        link.href = attachment.storage_url;
        link.download = attachment.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="space-y-2">
                {attachments.map((attachment) => (
                    <div
                        key={attachment.id}
                        className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <FileText className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{attachment.file_name}</div>
                                <div className="text-sm text-gray-500">
                                    {attachment.file_size ? formatBytes(attachment.file_size) : 'Unknown size'}
                                    {' • '}
                                    {new Date(attachment.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedAttachment(attachment)}
                            >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(attachment)}
                            >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* PDF Viewer Modal */}
            <Dialog open={!!selectedAttachment} onOpenChange={() => setSelectedAttachment(null)}>
                <DialogContent className="max-w-4xl h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>{selectedAttachment?.file_name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden">
                        {selectedAttachment && (
                            <iframe
                                src={selectedAttachment.storage_url}
                                className="w-full h-full border-0"
                                title={selectedAttachment.file_name}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
