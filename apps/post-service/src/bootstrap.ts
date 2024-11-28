import { migrator, sequelize } from './config';
import Post from './models/post';
import Comment from './models/comment';

export default async function bootstrap() {
  await sequelize.authenticate();
  console.log('Database connected!');

  await migrator.up();
  console.log('Database up to date!');

  Post.initializeHooks();
  Comment.initializeHooks();
}
