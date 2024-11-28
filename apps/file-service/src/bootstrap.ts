import { migrator, minio, sequelize } from './config';
import { buckets, publicPolicy } from './utils';

async function ensureMinioBucket(bucketName) {
  const exists = await minio.bucketExists(bucketName);

  if (!exists)
    await minio.makeBucket(bucketName, process.env.MINIO_REGION ?? 'us-east-1');
}

export default async function bootstrap() {
  await Promise.all(buckets.map(ensureMinioBucket));

  await minio.setBucketPolicy(
    'avatars',
    JSON.stringify(publicPolicy('avatars'))
  );

  await sequelize.authenticate();
  console.log('Database connected!');

  await migrator.up();
  console.log('Database up to date!');
}
