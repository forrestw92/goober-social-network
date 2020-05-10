import {
    BadRequestException,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly jwtService: AuthService) {
        super();
    }
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
    canActivate(context: ExecutionContext) {
        const authHeader = GqlExecutionContext.create(context)
            .getContext()
            .req.header('Authorization');
        if (!authHeader) {
            throw new BadRequestException('Authorization header not found.');
        }

        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer') {
            throw new BadRequestException(
                `Authentication type \'Bearer\' required. Found \'${type}\'`,
            );
        }
        const validationResult = this.jwtService.validateAccessToken(token);

        if (validationResult === true) {
            return super.canActivate(context);
        }

        throw new UnauthorizedException(validationResult);
    }
}
