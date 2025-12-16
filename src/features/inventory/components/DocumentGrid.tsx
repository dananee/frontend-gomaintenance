import { useState } from "react";
import { format } from "date-fns";
import { FileText, Image as ImageIcon, Download, Trash2, Eye, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { PartDocument } from "../types/inventory.types";
import { toast } from "sonner";

interface DocumentGridProps {
  documents: PartDocument[];
  onDelete: (id: string) => void;
}

export function DocumentGrid({ documents, onDelete }: DocumentGridProps) {
  const [previewDoc, setPreviewDoc] = useState<PartDocument | null>(null);

  const getIcon = (type: string) => {
    if (type.includes("image")) return <ImageIcon className="h-8 w-8 text-blue-500" />;
    if (type.includes("pdf")) return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleDownload = (doc: PartDocument) => {
      // Create a temporary link to download
      const link = document.createElement("a");
      link.href = doc.file_url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
        <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p>No documents attached.</p>
        <p className="text-sm">Upload specifications, manuals, or images.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="group relative border rounded-xl p-4 hover:shadow-md transition-shadow bg-card"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                    {getIcon(doc.media_type)}
                </div>
                <div>
                  <h4 className="font-medium text-sm truncate max-w-[150px]" title={doc.name}>
                    {doc.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(doc.file_size)} • {format(new Date(doc.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t">
                 {/* Preview Button (Only for images/PDFs usually supported in browser) */}
                <Button variant="ghost" size="sm" onClick={() => setPreviewDoc(doc)} title="Preview">
                    <Eye className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)} title="Download">
                    <Download className="h-4 w-4" />
                </Button>

                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                        if (confirm(`Are you sure you want to delete ${doc.name}?`)) {
                            onDelete(doc.id);
                        }
                    }}
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden">
             <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                  <DialogTitle className="font-semibold">{previewDoc?.name}</DialogTitle>
                 <Button variant="outline" size="sm" onClick={() => previewDoc && handleDownload(previewDoc)}>
                     <Download className="mr-2 h-4 w-4" /> Download
                 </Button>
             </div>
             <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                 {previewDoc?.media_type.includes("image") ? (
                     <img src={previewDoc.file_url} alt={previewDoc.name} className="max-w-full max-h-full object-contain shadow-lg" />
                 ) : (
                     <iframe src={previewDoc?.file_url} className="w-full h-full border-none rounded-md bg-white" title={previewDoc?.name} />
                 )}
             </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
