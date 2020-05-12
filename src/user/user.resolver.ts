import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserType } from './user.type';
import { CreateUserInput } from './user.input';
import { User } from './user.entity';
import { UserLoginInput } from './user-login.input';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AccessTokenType } from '../auth/access-token.type';

@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(type => UserType)
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput,
    ): Promise<User> {
        return this.userService.createUser(createUserInput);
    }

    @Mutation(type => AccessTokenType)
    async loginUser(
        @Args('userLoginInput') userLoginInput: UserLoginInput,
    ): Promise<{ accessToken: string }> {
        return this.userService.loginUser(userLoginInput);
    }

    @Query(type => UserType)
    async user(@Args('userId') userId: string): Promise<User> {
        return this.userService.getUserById(userId);
    }
}
