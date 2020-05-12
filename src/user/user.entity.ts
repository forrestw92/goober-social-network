import { Column, Entity, PrimaryColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    birthDate: string;

    @Column()
    isConfirmed: boolean;

    @Column()
    confirmKey: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    createdAt: string;

    @Column()
    updatedAt: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

    async validateConfirmKey(confirmKey: string): Promise<boolean> {
        return this.confirmKey === confirmKey;
    }
}
