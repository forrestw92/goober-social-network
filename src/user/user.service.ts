import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './user.input';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    async createUser(createUserInput: CreateUserInput): Promise<User> {
        return this.userRepository.createUser(createUserInput);
    }

    async getUserById(userId: string): Promise<User> {
        return this.userRepository.getUserById(userId);
    }
}
