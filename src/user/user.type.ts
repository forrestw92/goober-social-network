import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserType {
    @Field()
    id: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    birthDate: string;

    @Field()
    email: string;

    @Field()
    username: string;

    @Field()
    password: string;

    @Field()
    salt: string;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;
}
