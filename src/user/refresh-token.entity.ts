import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    refreshToken: string;

    @ManyToOne(
        () => User,
        user => user.refreshTokens,
        { eager: false },
    )
    user: User;

    @Column()
    userId: number;
}
