import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsString } from 'class-validator';

@InputType()
export class ChangePasswordInput {
    @Field()
    @IsString()
    currentPassword: string;

    @Field()
    @IsString()
    @IsDefined({ message: 'Please add new password' })
    newPassword: string;

    @Field()
    @IsString()
    @IsDefined({ message: 'Please add new password' })
    confirmNewPassword: string;
}
