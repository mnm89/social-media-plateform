import {
  KeycloakSessionConfig,
  DatabaseConfig,
  CacheConfig,
} from '@social-media-platform/common-config';

export const { sequelize, migrator } = DatabaseConfig(
  __dirname + '/models',
  __dirname + '/migrations/*.{js,ts}'
);

export const { keycloak, session } = KeycloakSessionConfig();
export const { client: cache } = CacheConfig();
