import { migrator, sequelize } from './config';
import { initializeModelsHooks } from './hooks';

export default async function bootstrap() {
  await sequelize.authenticate();
  console.log('Database connected!');

  await migrator.up();
  console.log('Database up to date!');

  await initializeModelsHooks();
  console.log('Models hooks initialized');
}
