import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Storage Configuration & S3 Client Singleton
 * Supports AWS S3, Cloudflare R2, or Supabase Storage (S3-Compatible Protocol)
 */
const s3Endpoint = process.env.SUPABASE_STORAGE_S3_ENDPOINT || process.env.AWS_S3_ENDPOINT;
const s3Region = process.env.AWS_REGION || "auto";

export const s3Client = new S3Client({
  region: s3Region,
  endpoint: s3Endpoint,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.SUPABASE_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SUPABASE_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true, // Required for MinIO, Cloudflare R2, and Supabase Storage
});

export const STORAGE_BUCKET = process.env.STORAGE_BUCKET_NAME || "myschool-private-docs";

export interface PresignedUploadOptions {
  key: string;
  contentType: string;
  expiresInSeconds?: number; // Defaults to 60 seconds
  metadata?: Record<string, string>;
}

/**
 * Generates an HMAC-signed URL allowing client browsers to upload directly to S3.
 * ZERO SERVER CPU BURDEN: The Next.js server only signs the URL (<10ms, <1KB).
 * The client browser streams the binary payload directly to S3/R2 storage.
 */
export async function createPresignedUploadUrl({
  key,
  contentType,
  expiresInSeconds = 60,
  metadata = {},
}: PresignedUploadOptions): Promise<{ uploadUrl: string; fileKey: string; expiresAt: Date }> {
  const command = new PutObjectCommand({
    Bucket: STORAGE_BUCKET,
    Key: key,
    ContentType: contentType,
    Metadata: metadata,
  });

  // Generate 60-second HMAC signed upload URL
  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: expiresInSeconds,
  });

  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  return {
    uploadUrl,
    fileKey: key,
    expiresAt,
  };
}

/**
 * Generates a short-lived download URL for private student documents.
 */
export async function createPresignedDownloadUrl(
  key: string,
  expiresInSeconds = 300 // 5 minutes default
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: STORAGE_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: expiresInSeconds,
  });
}
