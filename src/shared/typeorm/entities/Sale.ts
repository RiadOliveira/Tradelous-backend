import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { format } from 'date-fns';

@Entity('sales')
export default class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    companyId: string;

    @Column()
    employeeId: string;

    @Column()
    productId: string;

    @Column('timestamp with time zone', {
        default: Date.now(),
    })
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
