import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('RefreshToken')
export class RefreshTokenType {
    @Field()
    refreshToken: string;
}
