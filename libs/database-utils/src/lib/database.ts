import { Sequelize } from 'sequelize-typescript';
import { SequelizeStorage, Umzug } from 'umzug';

interface IDatabaseConfig {
  config: { development: unknown; test: unknown; production: unknown };
  sequelize: Sequelize;
  migrator: Umzug;
}
export function DatabaseConfig(
  modelsPath: string,
  migrationsGlob: string
): IDatabaseConfig {
  const config = {
    development: {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      logging: console.log, // Logs SQL queries in development
    },
    test: {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      logging: false,
    },
    production: {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Adjust based on SSL requirements
        },
      },
    },
  };

  const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    ...config[process.env.NODE_ENV || 'development'],
    models: [modelsPath],
  });

  const migrator = new Umzug({
    migrations: { glob: migrationsGlob },
    storage: new SequelizeStorage({
      sequelize, // Pass your Sequelize instance
    }),
    context: { sequelize, queryInterface: sequelize.getQueryInterface() },
    logger: console,
  });

  return { config, sequelize, migrator };
}
