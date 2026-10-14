import { z } from "zod";
import crypto from "crypto";
import { createPresignedUploadUrl } from "@/lib/storage";

// Allowed MIME types: PDF, JPEG, PNG, WebP
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 Megabytes

export const PresignedUploadRequestSchema = z.object({
  studentId: z.string().cuid(),
  title: z.string().min(2).max(100),
  fileName: z.string().min(1).max(255),
  fileType: z.enum(ALLOWED_MIME_TYPES, {
    errorMap: () => ({ message: "Only PDF, JPEG, PNG, and WebP files are permitted" }),
  }),
  fileSize: z.number().max(MAX_FILE_SIZE_BYTES, "Maximum file size is 15MB"),
  certificateType: z
    .enum([
      "TRANSFER_CERTIFICATE",
      "CHARACTER_CERTIFICATE",
      "MIGRATION_CERTIFICATE",
      "MEDICAL_CLEARANCE",
      "NO_DUES_SLIP",
    ])
    .optional(),
});

export type PresignedUploadInput = z.infer<typeof PresignedUploadRequestSchema>;

export interface PresignedUploadResult {
  success: boolean;
  uploadUrl: string;
  fileKey: string;
  expiresAt: string;
  documentId: string;
}

/**
 * Server Action / Domain Service:
 * Validates document metadata and issues a 60-second HMAC presigned upload URL.
 * The client browser streams the file directly to S3 / Cloudflare R2.
 */
export async function getPresignedDocumentUrl(
  rawInput: PresignedUploadInput,
  currentUserId: string
): Promise<PresignedUploadResult> {
  // 1. Zod runtime validation
  const validated = PresignedUploadRequestSchema.parse(rawInput);

  // 2. Sanitize filename & create partitioned storage key
  const fileExt = validated.fileName.split(".").pop()?.toLowerCase() || "pdf";
  const uniqueToken = crypto.randomUUID();
  const sanitizedTitle = validated.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .substring(0, 30);

  // Partitioned key: students/[studentId]/[uniqueToken]_[sanitizedTitle].[ext]
  const fileKey = `students/${validated.studentId}/${uniqueToken}_${sanitizedTitle}.${fileExt}`;

  // 3. Generate 60-second HMAC presigned S3 URL (Zero CPU load on Next.js server)
  const { uploadUrl, expiresAt } = await createPresignedUploadUrl({
    key: fileKey,
    contentType: validated.fileType,
    expiresInSeconds: 60,
    metadata: {
      uploadedBy: currentUserId,
      studentId: validated.studentId,
      originalName: validated.fileName,
    },
  });

  // Mock document ID generation (in production, Prisma creates the pending row)
  const documentId = `doc_${uniqueToken}`;

  return {
    success: true,
    uploadUrl,
    fileKey,
    expiresAt: expiresAt.toISOString(),
    documentId,
  };
}
