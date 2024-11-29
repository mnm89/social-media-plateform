import 'pg';
import 'pg-hstore';
import 'sequelize';
import { config } from 'dotenv';

config();
export * from './lib/database';
