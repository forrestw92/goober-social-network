import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class UserLoginInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    password: string;
}
