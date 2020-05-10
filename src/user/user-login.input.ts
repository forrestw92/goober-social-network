import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class UserLoginInput {
    @Field()
    @IsString()
    username: string;

    @Field()
    @IsEmail()
    @IsOptional()
    email: string;

    @Field()
    @IsString()
    password: string;
}
