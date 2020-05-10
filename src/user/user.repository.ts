import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInput } from './user.input';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
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

        const user: User = await this.create({
            id: uuid(),
            password: hashedPassword,
            username,
            email,
            firstName,
            lastName,
            birthDate,
            createdAt: nowISO,
            updatedAt: nowISO,
        });

        return this.save(user);
    }

    async getUserById(userId: string): Promise<User> {
        const user: User = await this.findOne({ id: userId });
        if (!user) {
            throw new BadRequestException();
        }
        return user;
    }
    private async hashPassword(
        password: string,
        salt: string,
    ): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}
