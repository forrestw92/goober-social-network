import { Field, InputType } from '@nestjs/graphql';
import {
    IsDateString,
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    firstName: string;

    @Field()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    lastName: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    @MinLength(2)
    @MaxLength(25)
    username: string;

    @Field()
    @IsString()
    @IsDateString()
    birthDate: string;

    @Field()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password to weak',
    })
    password: string;

    @Field()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password to weak',
    })
    confirmPassword: string;
}
