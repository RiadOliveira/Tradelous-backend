import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import Product from './Product';
import User from './User';

@Entity('companies')
export default class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    cnpj: number;

    @Column()
    adress: string;

    @Column('uuid')
    adminId: string;

    @OneToMany(() => User, user => user.company, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    workers: User[];

    @OneToMany(() => Product, product => product.company, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    products: Product[];

    @Column()
    logo?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
