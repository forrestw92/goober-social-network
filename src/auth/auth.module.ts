import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([UserRepository]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.secret'),
                signOptions: {
                    expiresIn: configService.get<number>(
                        'jwt.signOptions.expiresIn',
                    ),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService],
})
export class AuthModule {}
