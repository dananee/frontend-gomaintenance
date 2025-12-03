"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import { VehicleDocument } from "@/features/vehicles/api/vehicleDocuments";

interface VehicleDocumentsProps {
  documents: VehicleDocument[];
  onUpload: () => void;
  onDelete: (docId: string) => void;
  isDeleting?: boolean;
}

export function VehicleDocuments({
  documents,
  onUpload,
  onDelete,
  isDeleting,
}: VehicleDocumentsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Upload insurance, registration, and inspection paperwork for this vehicle.
        </p>
        <Button size="sm" onClick={onUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
            <FileText className="h-10 w-10" />
            <p className="text-sm">No documents uploaded yet.</p>
            <Button onClick={onUpload} size="sm" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload your first document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="transition-shadow hover:shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="icon" title="Download">
                    <a href={doc.file_url} target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => onDelete(doc.id)}
                    disabled={isDeleting}
                    title="Delete document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
