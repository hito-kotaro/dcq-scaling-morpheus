import { DataSource } from 'typeorm';
const source = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'app',
  password: 'password',
  database: 'dcq_dev',
  entities: ['src/entity/*.entity.ts'],
  migrations: ['src/migration/**/*.ts'],
  synchronize: true, // TODO: 本番環境では推奨されていないため、環境によって分ける
});

export default source;
