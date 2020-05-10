import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    providers: [UserResolver, UserService],
})
export class UserModule {}
