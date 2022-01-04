import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Company from './Company';

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column('uuid')
    companyId?: string;

    @ManyToOne(() => Company, company => company.employees, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    company: Company;

    @Column('boolean', { default: false })
    isAdmin: boolean;

    @Column()
    avatar?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
