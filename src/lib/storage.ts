import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 is fully S3 compatible. 
// We use the AWS SDK to interface with it seamlessly.
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Generates a pre-signed URL allowing secure, direct-to-bucket uploads from the client-side.
 * This prevents our Next.js server from acting as a middleman for massive files.
 */
export async function generateUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  // URL expires in 15 minutes
  return await getSignedUrl(r2Client, command, { expiresIn: 900 });
}

/**
 * Generates a pre-signed URL allowing users to securely download their processed files.
 */
export async function generateDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  // URL expires in 1 hour
  return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
}
