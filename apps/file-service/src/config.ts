import {
  KeycloakSessionConfig,
  DatabaseConfig,
  CacheConfig,
  MinioConfig,
} from '@social-media-platform/common-config';
import multer from 'multer';

export const { sequelize, migrator } = DatabaseConfig(
  __dirname + '/models',
  __dirname + '/migrations/*.{js,ts}'
);

export const { keycloak, session } = KeycloakSessionConfig();
export const { client: cache } = CacheConfig();
export const { client: minio } = MinioConfig();
export const upload = multer({ dest: 'uploads/' });
