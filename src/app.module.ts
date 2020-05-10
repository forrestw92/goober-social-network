import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.development', '.env.production'],
            load: [databaseConfig, jwtConfig],
            isGlobal: true,
        }),
        UserModule,
    ],
})
export class AppModule {}
