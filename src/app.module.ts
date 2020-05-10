import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';

import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.development', '.env.production'],
            load: [databaseConfig, jwtConfig],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mongodb',
                username: configService.get<string>('username'),
                port: configService.get<number>('port'),
                password: configService.get<string>('password'),
                host: configService.get<string>('host'),
                database: configService.get<string>('name'),
                synchronize: configService.get<boolean>('synchronize'),
                entities: [__dirname + '/**/*.entity.{js,ts}'],
                useUnifiedTopology: true,
            }),
            inject: [ConfigService],
        }),
        GraphQLModule.forRoot({
            autoSchemaFile: true,
        }),
        UserModule,
    ],
})
export class AppModule {}
