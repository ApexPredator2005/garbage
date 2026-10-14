"use client";

import React, { useState, useRef } from "react";

interface DirectUploadZoneProps {
  studentId: string;
  certificateType?: "TRANSFER_CERTIFICATE" | "CHARACTER_CERTIFICATE" | "MIGRATION_CERTIFICATE" | "MEDICAL_CLEARANCE" | "NO_DUES_SLIP";
  onUploadSuccess: (fileKey: string, documentId: string) => void;
  onUploadError?: (error: string) => void;
}

export const DirectUploadZone: React.FC<DirectUploadZoneProps> = ({
  studentId,
  certificateType,
  onUploadSuccess,
  onUploadError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (file: File) => {
    // 1. Client-Side Validation
    if (file.size > 15 * 1024 * 1024) {
      const err = "File exceeds maximum allowed size of 15MB.";
      setStatusMessage(err);
      onUploadError?.(err);
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      const err = "Unsupported file format. Please upload PDF, PNG, or JPEG.";
      setStatusMessage(err);
      onUploadError?.(err);
      return;
    }

    setSelectedFile(file);
    setStatusMessage("");
  };

  const handleDirectUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setStatusMessage("Requesting secure presigned upload ticket...");

      // Step 1: Request 60-second HMAC presigned upload URL from Server Action
      const response = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          title: selectedFile.name.replace(/\.[^/.]+$/, ""),
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
          certificateType,
        }),
      });

      const data = await response.json();
      if (!data.success || !data.uploadUrl) {
        throw new Error(data.error || "Failed to obtain upload authorization");
      }

      setStatusMessage("Streaming binary payload directly to S3/R2...");

      // Step 2: Stream file DIRECTLY to S3/Cloudflare R2 (Bypassing Next.js server memory)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", data.uploadUrl, true);
        xhr.setRequestHeader("Content-Type", selectedFile.type);

        // Track live upload progress
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`S3 direct upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during direct S3 streaming"));
        xhr.send(selectedFile);
      });

      // Step 3: Success Callback
      setUploadProgress(100);
      setStatusMessage("File successfully uploaded and stored!");
      setIsUploading(false);
      setSelectedFile(null);
      onUploadSuccess(data.fileKey, data.documentId);
    } catch (err: any) {
      setIsUploading(false);
      const errMsg = err.message || "Upload failed. Please retry.";
      setStatusMessage(errMsg);
      onUploadError?.(errMsg);
    }
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white border border-[#E5DFD7] rounded-xl shadow-sm">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragging ? "border-[#682038] bg-[#F6EDEE]" : "border-[#D6CEC4] bg-[#FAF7F2] hover:bg-[#F4EFEB]"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileSelection(e.target.files[0]);
            }
          }}
        />

        <div className="text-3xl mb-2">📄</div>
        <p className="text-sm font-semibold text-[#242424]">
          {selectedFile ? selectedFile.name : "Click to select or drag document here"}
        </p>
        <p className="text-xs text-[#6E6862] mt-1">
          PDF, PNG, JPEG up to 15MB (Direct S3 Presigned Upload)
        </p>
      </div>

      {selectedFile && !isUploading && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-[#6E6862]">
            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </span>
          <button
            onClick={handleDirectUpload}
            className="px-4 py-2 bg-[#682038] hover:bg-[#54192D] text-white text-xs font-semibold rounded-md transition-colors"
          >
            Start Direct Upload
          </button>
        </div>
      )}

      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[#6E6862] mb-1">
            <span>Direct S3 Upload Progress</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-[#E5DFD7] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#682038] h-full transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {statusMessage && (
        <p className={`text-xs mt-3 ${statusMessage.includes("failed") ? "text-red-600" : "text-[#2E7D32]"}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};
