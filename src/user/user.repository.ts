import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInput } from './user.input';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { UserLoginInput } from './user-login.input';
import { ChangePasswordInput } from './change-password.input';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(createUserInput: CreateUserInput): Promise<User> {
        const {
            password,
            confirmPassword,
            lastName,
            firstName,
            email,
            birthDate,
            username,
        } = createUserInput;
        if (password !== confirmPassword) {
            throw new BadRequestException("Passwords don't match");
        }
        const salt: string = await bcrypt.genSalt();
        const nowISO: string = new Date().toISOString();
        const hashedPassword = await this.hashPassword(password, salt);

        return this.create({
            id: uuid(),
            password: hashedPassword,
            username,
            email: email.toLowerCase(),
            firstName,
            lastName,
            birthDate,
            confirmKey: '',
            salt,
            isConfirmed: false,
            createdAt: nowISO,
            updatedAt: nowISO,
        });
    }

    async getUserById(userId: string): Promise<User> {
        const user: User = await this.findOne({ id: userId });
        if (!user) {
            throw new BadRequestException();
        }
        return user;
    }

    async validatePassword(
        userLoginInput: UserLoginInput,
    ): Promise<User | null> {
        const { password, email } = userLoginInput;
        if (!email) {
            throw new UnauthorizedException('Please login with email');
        }
        let user: User = await this.findOne({
            where: { email: email.toLowerCase() },
        });
        if (user && (await user.validatePassword(password))) {
            return user;
        } else {
            return null;
        }
    }

    async validateConfirmKey(confirmKey: string): Promise<User> {
        const user: User = await this.findOne({
            confirmKey,
        });
        if (user && (await user.validateConfirmKey(confirmKey))) {
            return user;
        } else {
            return null;
        }
    }

    async changePassword(
        changePasswordInput: ChangePasswordInput,
        user: User,
    ): Promise<User> {
        const { currentPassword, newPassword } = changePasswordInput;
        const validatePassword = await user.validatePassword(currentPassword);
        const samePasswordCheck = await user.validatePassword(newPassword);
        if (samePasswordCheck) {
            throw new BadRequestException("Password can't be same as current.");
        }
        if (validatePassword) {
            const salt = await bcrypt.genSalt();
            user.password = await this.hashPassword(newPassword, salt);
            user.salt = salt;
            return this.save(user);
        }
        return null;
    }
    protected async hashPassword(
        password: string,
        salt: string,
    ): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}
