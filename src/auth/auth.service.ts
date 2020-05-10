import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async createAccessToken(user: User): Promise<{ accessToken: string }> {
        const { username } = user;
        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };
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
