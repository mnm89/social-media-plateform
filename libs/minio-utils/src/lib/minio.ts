import { Client } from 'minio';
interface IMinioConfig {
  client: Client;
}
export function MinioConfig(): IMinioConfig {
  return {
    client: new Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT, 10),
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      useSSL: false,
    }),
  };
}
