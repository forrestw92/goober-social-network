import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserType } from './user.type';
import { CreateUserInput } from './Inputs/user.input';
import { User } from './user.entity';
import { UserLoginInput } from './Inputs/user-login.input';
import { UseGuards } from '@nestjs/common';
import { AccessTokenType } from '../auth/access-token.type';
import { ChangePasswordInput } from './Inputs/change-password.input';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from '../auth/auth.guard';

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
    @UseGuards(JwtAuthGuard)
    @Mutation(type => UserType)
    async changePassword(
        @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
        @GetUser() user: User,
    ) {
        return this.userService.changePassword(changePasswordInput, user);
    }
    @Query(type => UserType)
    async user(@Args('userId') userId: string): Promise<User> {
        return this.userService.getUserById(userId);
    }
}
