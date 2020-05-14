import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './user.input';
import { User } from './user.entity';
import { SendGridService } from '../send-grid/send-grid.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { UserLoginInput } from './user-login.input';
import { ChangePasswordInput } from './change-password.input';

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

    async loginUser(
        userLoginInput: UserLoginInput,
    ): Promise<{ accessToken: string }> {
        const user: User = await this.userRepository.validatePassword(
            userLoginInput,
        );
        if (!user) {
            throw new UnauthorizedException('Invalid login credentials');
        }
        return this.authService.createAccessToken(user);
    }

    async changePassword(
        changePasswordInput: ChangePasswordInput,
        user: User,
    ): Promise<User> {
        const { newPassword, confirmNewPassword } = changePasswordInput;
        if (newPassword !== confirmNewPassword) {
            throw new BadRequestException("Passwords don't match");
        }
        const updatedUser: User = await this.userRepository.changePassword(
            changePasswordInput,
            user,
        );
        if (!updatedUser) {
            throw new BadRequestException('Incorrect password');
        }
        return updatedUser;
    }

    async getUserById(userId: string): Promise<User> {
        return this.userRepository.getUserById(userId);
    }
}
