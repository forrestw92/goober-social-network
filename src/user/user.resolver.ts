import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserType } from './user.type';
import { CreateUserInput } from './user.input';
import { User } from './user.entity';

@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}
    @Mutation(type => UserType)
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput,
    ): Promise<User> {
        return this.userService.createUser(createUserInput);
    }

    @Query(type => UserType)
    async user(@Args('userId') userId: string): Promise<User> {
        return this.userService.getUserById(userId);
    }
}
