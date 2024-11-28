import { migrator, sequelize } from './config';
import Friendship from './models/friendship';

export default async function bootstrap() {
  await sequelize.authenticate();
  console.log('Database connected!');

  await migrator.up();
  console.log('Database up to date!');

  Friendship.initializeHooks();
}
