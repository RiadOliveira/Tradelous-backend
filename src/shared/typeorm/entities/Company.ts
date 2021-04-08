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
    cnpj: string;

    @Column()
    adress: string;

    @Column('uuid')
    adminID: string;

    @OneToMany(() => User, user => user.company, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    workers: User[];

    @OneToMany(() => Product, product => product.companyId, {
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
