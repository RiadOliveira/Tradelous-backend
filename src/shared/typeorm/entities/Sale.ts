import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { format } from 'date-fns';

import User from './User';
import Product from './Product';

@Entity('sales')
export default class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    companyId: string;

    @Column('uuid')
    employeeId: string;

    @OneToOne(() => User, user => user, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @Transform(({ value: { name, email, avatar } }) => ({
        name,
        email,
        avatar,
    }))
    @JoinColumn({ name: 'employeeId', referencedColumnName: 'id' })
    employee: User;

    @Column('uuid')
    productId: string;

    @OneToOne(() => Product, product => product, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
    @Transform(({ value: { name, price, quantity, brand, image } }) => ({
        name,
        price,
        quantity,
        brand,
        image,
    }))
    product: Product;

    @Column('timestamp with time zone')
    @Transform(({ value }) => format(value, 'dd/MM/yyyy'))
    date: Date;

    @Column()
    method: 'money' | 'card';

    @Column()
    quantity: number;

    @Column()
    totalPrice: number;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
