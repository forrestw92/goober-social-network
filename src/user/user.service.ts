import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './user.input';
import { User } from './user.entity';
import { MailService } from '@sendgrid/mail';
import { SendGridService } from '../send-grid/send-grid.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        private sendGridService: SendGridService,
        private configService: ConfigService,
    ) {}

    async createUser(createUserInput: CreateUserInput): Promise<User> {
        const user = await this.userRepository.createUser(createUserInput);

        if (user) {
            await this.sendGridService.send({
                to: user.email,
                from: this.configService.get<string>(
                    'mailing.confirmAccount.from',
                ),
                subject: this.configService.get<string>(
                    'mailing.confirmAccount.subject',
                ),
                text: 'Confirm account',
                html: 'Confirm account',
            });
        }
        return user;
    }

    async getUserById(userId: string): Promise<User> {
        return this.userRepository.getUserById(userId);
    }
}
