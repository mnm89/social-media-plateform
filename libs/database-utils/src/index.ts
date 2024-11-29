import 'pg';
import 'pg-hstore';
import { config } from 'dotenv';

config();
export * from './lib/database';
