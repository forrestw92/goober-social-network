import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendGridModule } from '../send-grid/send-grid.module';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenRepository } from './refresh-token.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository, RefreshTokenRepository]),
        SendGridModule,
        AuthModule,
    ],
    providers: [UserResolver, UserService],
    exports: [UserService],
})
export class UserModule {}
