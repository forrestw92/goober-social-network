import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { JwtPayload } from './jwt.payload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    createAccessToken(user: User): { accessToken: string } {
        const { username } = user;
        const payload: JwtPayload = { username };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }

    createEmailConfirmKey(email: string): string {
        const payload = { email };
        return this.jwtService.sign(payload, {
            expiresIn: this.configService.get<string>(
                'auth.confirmKeyExpireTime',
            ),
        });
    }

    validateEmailConfirmKey(token: string, user: User): boolean {
        try {
            this.jwtService.verify(token, {
                ignoreExpiration: this.configService.get<boolean>(
                    'auth.ignoreConfirmKeyExpiration',
                ),
            });
            const payload: any = this.jwtService.decode(token);

            if (!payload.email) {
                throw new UnauthorizedException(
                    'Invalid Email confirmation key',
                );
            }

            if (payload.email === user.email) {
                return true;
            }
            throw new UnauthorizedException();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Email confirm link expired.');
            }
            return error;
        }
    }

    validateAccessToken(token: string): boolean {
        try {
            this.jwtService.verify(token);
            return true;
        } catch (error) {
            return error.name;
        }
    }
}
