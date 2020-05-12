import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './user.input';
import { User } from './user.entity';
import { SendGridService } from '../send-grid/send-grid.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        private sendGridService: SendGridService,
        private configService: ConfigService,
        private authService: AuthService,
    ) {}

    async createUser(createUserInput: CreateUserInput): Promise<User> {
        const user = await this.userRepository.createUser(createUserInput);
        user.confirmKey = this.authService.createEmailConfirmKey(user.email);

        if (user) {
            await this.sendGridService.sendConfirmEmail(user);
        }
        return this.userRepository.save(user);
    }

    async getUserById(userId: string): Promise<User> {
        return this.userRepository.getUserById(userId);
    }
}
