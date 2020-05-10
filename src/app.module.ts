import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.development', '.env.production'],
            load: [databaseConfig, jwtConfig],
            isGlobal: true,
        }),
    ],
})
export class AppModule {}
