// web/src/utils/s3.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(fileBuffer: Buffer, originalFilename: string): Promise<string> {
  const fileExtension = originalFilename.split('.').pop() || 'jpg';
  const key = `products/${randomUUID()}.${fileExtension}`;

  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: fileBuffer,
    ContentType: `image/${fileExtension === 'png' ? 'png' : 'jpeg'}`,
    ACL: 'public-read',
  });

  await s3Client.send(uploadCommand);
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}