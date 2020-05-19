import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { JwtPayload } from './jwt.payload';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    public createAccessToken(user: User): { accessToken: string } {
        const { username } = user;
        const payload: JwtPayload = { username };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }

    public createRefreshToken(user: User): { refreshToken: string } {
        const { username } = user;
        const payload: JwtPayload = { username };
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get<string>(
                'auth.refreshTokenExpireTime',
            ),
        });
        return { refreshToken };
    }

    public createEmailConfirmKey(email: string): string {
        const payload = { email };
        return this.jwtService.sign(payload, {
            expiresIn: this.configService.get<string>(
                'auth.confirmKeyExpireTime',
            ),
        });
    }

    public validateEmailConfirmKey(token: string, user: User): boolean {
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

    public async confirmAccount(confirmKey: string): Promise<boolean> {
        const user = await this.userRepository.getUserByConfirmKey(confirmKey);
        if (!user) {
            throw new UnauthorizedException('Invalid Confirm key');
        }
        const validated = this.validateEmailConfirmKey(confirmKey, user);
        if (validated) {
            const confirmedUser = await this.userRepository.confirmAccount(
                user,
            );
            if (!confirmedUser) {
                throw new InternalServerErrorException(
                    'Error confirming account.',
                );
            }
            return true;
        }
        return false;
    }

    public validateAccessToken(token: string): boolean {
        try {
            this.jwtService.verify(token);
            return true;
        } catch (error) {
            return error.name;
        }
    }
}
