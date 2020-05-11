import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendGridModule } from '../send-grid/send-grid.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository]), SendGridModule],
    providers: [UserResolver, UserService],
    exports: [UserService],
})
export class UserModule {}
