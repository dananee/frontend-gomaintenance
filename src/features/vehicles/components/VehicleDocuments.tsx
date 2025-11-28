"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image as ImageIcon, Download, Trash2 } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  url?: string;
}

interface VehicleDocumentsProps {
  vehicleId: string;
  documents?: Document[];
}

export function VehicleDocuments({ vehicleId, documents = [] }: VehicleDocumentsProps) {
  const mockDocuments: Document[] = documents.length > 0 ? documents : [
    {
      id: "1",
      name: "Registration.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedAt: "2024-11-01",
    },
    {
      id: "2",
      name: "Insurance Card.png",
      type: "image",
      size: "856 KB",
      uploadedAt: "2024-10-15",
    },
    {
      id: "3",
      name: "Inspection Report.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadedAt: "2024-09-20",
    },
  ];

  const handleUpload = () => {
    // TODO: Implement file upload
    console.log("Upload clicked for vehicle:", vehicleId);
  };

  const handleDownload = (doc: Document) => {
    // TODO: Implement file download
    console.log("Download:", doc.name);
  };

  const handleDelete = (doc: Document) => {
    // TODO: Implement file delete
    console.log("Delete:", doc.name);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload and manage vehicle documents, certificates, and inspection reports
        </p>
        <Button onClick={handleUpload} size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {mockDocuments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No documents uploaded yet
            </p>
            <Button onClick={handleUpload} variant="outline" className="mt-4" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Your First Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {mockDocuments.map((doc) => (
            <Card key={doc.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {getFileIcon(doc.type)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {doc.size} • Uploaded {doc.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(doc)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc)}
                    title="Delete"
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
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
