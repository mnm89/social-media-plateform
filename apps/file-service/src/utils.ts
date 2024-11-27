import fs from 'fs';
import { MinioConfig } from '@social-media-platform/common-config';
import Storage from './models/storage';

export function getFileTypeFromMimeType(mimetype) {
  if (mimetype.includes('video')) return 'video';
  if (mimetype.includes('image')) return 'image';
  if (mimetype.includes('audio')) return 'audio';
  return 'other';
}
export const buckets = [
  process.env.MINIO_BUCKET_NAME ?? 'public',
  'avatars',
  'medias',
];
export const publicPolicy = (bucketName) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Action: ['s3:GetBucketLocation', 's3:ListBucket'],
      Resource: [`arn:aws:s3:::${bucketName}`],
    },
    {
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Action: ['s3:GetObject'],
      Resource: [`arn:aws:s3:::${bucketName}/*`],
    },
  ],
});
export async function uploadFileToMinio(
  file: Express.Multer.File,
  storage: Storage,
  meta: Record<string, string> = {}
) {
  try {
    const { client } = MinioConfig();
    await client.fPutObject(
      storage.get('bucket') as string,
      storage.get('path') as string,
      file.path,
      {
        'Content-Type': file.mimetype,
        'x-amz-meta-storageId': storage.get('id') as string,
        'x-amz-meta-originalName': file.originalname,
        ...meta,
      }
    );

    // Clean up: Remove the file after successful upload
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
    return true;
  } catch (error) {
    console.error('Error during MinIO upload process:', error);
    return false;
  }
}
export async function deleteFileFromMinio(storage: Storage) {
  try {
    const { client } = MinioConfig();
    await client.removeObject(
      storage.get('bucket') as string,
      storage.get('path') as string
    );
    return true;
  } catch (error) {
    console.error('Error during MinIO upload process:', error);
    return false;
  }
}
