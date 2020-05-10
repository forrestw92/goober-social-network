import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('AccessToken')
export class AccessTokenType {
    @Field()
    accessToken: string;
}
