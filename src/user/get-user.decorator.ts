import { User } from './user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User => {
        return GqlExecutionContext.create(ctx).getContext().req.user;
    },
);
