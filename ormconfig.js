module.exports = {
  type: 'postgres',
  synchronize: false,
  host: 'localhost',
  port: 5432,
  username: 'thor',
  password: 'root',
  database: 'wallbox',
  entities: ['src/**/*model.ts'],
  migrations: [
    'src/migration/**/*.ts',
  ],
  cli: {
    migrationsDir: 'src/migration',
  },
  logging: true,
};
