import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { registerAs } from '@nestjs/config';

export default registerAs('ormConfig', (): DataSourceOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [join(__dirname, '..', 'db', 'entities', '*.{ts,js}')],
  };
});
