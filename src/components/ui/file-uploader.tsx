"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, File, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string; // e.g., ".pdf,.jpg,.png"
  maxSizeMB?: number;
}

export function FileUploader({
  onFileSelect,
  accept = ".pdf,.jpg,.jpeg,.png,.docx",
  maxSizeMB = 10,
}: FileUploaderProps) {
  const t = useTranslations("features.vehicles.documents");
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const validateFile = (file: File): boolean => {
    // Check size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Max size is ${maxSizeMB}MB.`);
      return false;
    }
    
    // Check extension (basic check)
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    const acceptedExtensions = accept.split(",").map(e => e.trim().toLowerCase());
    
    // Simplistic check - for robust check we'd parse MIME types properly
    const isValidType = acceptedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!isValidType) {
      setError("Unsupported file type.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors duration-200 cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50",
          error && "border-red-500 bg-red-50 dark:bg-red-900/10"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileInput}
        />
        
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 dark:bg-blue-900/20">
          <Upload className="h-6 w-6" />
        </div>
        
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("dragDropTitle")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("dragDropSubtitle")}
          </p>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          {t("supportedFormats")}
        </p>

        {error && (
          <div className="absolute inset-x-0 bottom-2 text-center text-xs font-medium text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
