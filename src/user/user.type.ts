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
    isConfirmed: boolean;

    @Field()
    email: string;

    @Field()
    username: string;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;
}
