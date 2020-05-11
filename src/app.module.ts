import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { SendGridModule } from './send-grid/send-grid.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import mailingConfig from './config/mailing.config';
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.development', '.env.production'],
            load: [databaseConfig, jwtConfig, mailingConfig],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                return {
                    type: 'mysql',
                    username: configService.get<string>('database.username'),
                    port: configService.get<number>('database.port'),
                    password: configService.get<string>('database.password'),
                    host: configService.get<string>('database.host'),
                    database: configService.get<string>('database.database'),
                    synchronize: configService.get<boolean>(
                        'database.synchronize',
                    ),
                    entities: [__dirname + '/**/*.entity.{js,ts}'],
                    useUnifiedTopology: true,
                };
            },
            inject: [ConfigService],
        }),
        GraphQLModule.forRoot({
            autoSchemaFile: true,
        }),
        UserModule,
        AuthModule,
        SendGridModule,
    ],
})
export class AppModule {}
