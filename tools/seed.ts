import { Sequelize as SequelizeUsers } from 'sequelize-typescript';
import { Sequelize as SequelizePosts } from 'sequelize-typescript';
import Post from '../apps/post-service/src/models/post';
import Comment from '../apps/post-service/src/models/comment';
import Like from '../apps/post-service/src/models/like';
import Friendship from '../apps/user-service/src/models/friendship';
import { friendships, posts } from './data';

const USER_DB = new SequelizeUsers(
  process.env.USER_DB_URL ??
    'postgres://user_user:user_password@localhost:5433/user_service'
);
const POST_DB = new SequelizePosts(
  process.env.POST_DB_URL ??
    'postgres://post_user:post_password@localhost:5434/post_service'
);
async function seed() {
  // Seed Users
  USER_DB.addModels([Friendship]);
  await Friendship.bulkCreate(friendships);

  // Seed Posts
  POST_DB.addModels([Post, Comment, Like]);
  await Post.bulkCreate(posts);

  console.log('Databases seeded');
}
seed().catch((err) => console.error(err));
