import {
    Controller,
    Get,
    Param,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Get('/email/confirm/:confirmKey')
    async confirmAccount(
        @Param('confirmKey') confirmKey: string,
        @Res() res: Response,
    ): Promise<void> {
        const user = await this.userRepository.validateConfirmKey(confirmKey);
        if (!user) {
            throw new UnauthorizedException('Invalid Confirm key');
        }
        const validated = this.authService.validateEmailConfirmKey(
            confirmKey,
            user,
        );
        if (validated) {
            user.isConfirmed = true;
            user.confirmKey = '';
            await this.userRepository.save(user);
            return res.redirect(
                this.configService.get<string>('auth.redirectUrlOnceConfirmed'),
            );
        }
    }
}
