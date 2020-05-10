import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
    'database',
    (): TypeOrmModuleOptions => ({
        username: process.env.DB_USERNAME,
        port: +process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        synchronize: process.env.DB_SYNC === 'true',
    }),
);
