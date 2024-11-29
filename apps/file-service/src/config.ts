import { CacheConfig } from '@social-media-platform/cache-utils';
import { DatabaseConfig } from '@social-media-platform/database-utils';
import { KeycloakSessionConfig } from '@social-media-platform/keycloak-utils';
import { MinioConfig } from '@social-media-platform/minio-utils';
import multer from 'multer';

export const { sequelize, migrator } = DatabaseConfig(
  __dirname + '/models',
  __dirname + '/migrations/*.{js,ts}'
);

export const { keycloak, session } = KeycloakSessionConfig();
export const { client: cache } = CacheConfig();
export const { client: minio } = MinioConfig();
export const upload = multer({ dest: 'uploads/' });
