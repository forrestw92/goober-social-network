import { Controller, Get, Param, Res } from '@nestjs/common';
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
        const validated = await this.authService.confirmAccount(confirmKey);
        if (validated) {
            return res.redirect(
                this.configService.get<string>('auth.redirectUrlOnceConfirmed'),
            );
        }
    }
}
