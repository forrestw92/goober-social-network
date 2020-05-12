import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendGridModule } from '../send-grid/send-grid.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
        SendGridModule,
        AuthModule,
    ],
    providers: [UserResolver, UserService],
    exports: [UserService],
})
export class UserModule {}
