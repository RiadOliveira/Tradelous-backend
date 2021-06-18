import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

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

    @Column('timestamp with time zone')
    date?: Date;

    @Column()
    type: string;

    @Column()
    quantity: number;

    @Column()
    totalPrice: number;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
