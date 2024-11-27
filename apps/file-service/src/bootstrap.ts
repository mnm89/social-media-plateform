import {
  MinioConfig,
  DatabaseConfig,
} from '@social-media-platform/common-config';
import { buckets, publicPolicy } from './utils';

const { client } = MinioConfig();
const { sequelize, migrator } = DatabaseConfig(
  __dirname + '/models',
  __dirname + '/migrations/*.{js,ts}'
);

async function ensureMinioBucket(bucketName) {
  const exists = await client.bucketExists(bucketName);

  if (!exists)
    await client.makeBucket(
      bucketName,
      process.env.MINIO_REGION ?? 'us-east-1'
    );
}

export default async function bootstrap() {
  await Promise.all(buckets.map(ensureMinioBucket));

  await client.setBucketPolicy(
    'avatars',
    JSON.stringify(publicPolicy('avatars'))
  );

  await sequelize.authenticate();
  console.log('Database connected!');

  await migrator.up();
  console.log('Database up to date!');
}
