import { ensureUsersProfileAttributes } from '@social-media-platform/keycloak-utils';
import { migrator, sequelize } from './config';
import Friendship from './models/friendship';
import { ensureDefaultPrivacySettings } from './utils';
import { attributes, groups, defaultUsersIds } from './constants';

export default async function bootstrap() {
  await sequelize.authenticate();
  console.log('Database connected!');

  await migrator.up();
  console.log('Database up to date!');

  Friendship.initializeHooks();

  await ensureUsersProfileAttributes(attributes, groups);

  await Promise.all(defaultUsersIds.map(ensureDefaultPrivacySettings));
}
