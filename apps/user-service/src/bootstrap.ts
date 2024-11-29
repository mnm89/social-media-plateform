import { ensureUsersProfileAttributes } from '@social-media-platform/keycloak-utils';
import { migrator, sequelize } from './config';
import { ensureDefaultPrivacySettings } from './utils';
import { attributes, groups, defaultUsersIds } from './constants';
import { initializeModelsHooks } from './hooks';

export default async function bootstrap() {
  await sequelize.authenticate();
  console.log('Database connected!');

  await migrator.up();
  console.log('Database up to date!');

  await initializeModelsHooks();
  console.log('Models hooks initialized');

  await ensureUsersProfileAttributes(attributes, groups);

  await Promise.all(defaultUsersIds.map(ensureDefaultPrivacySettings));
}
