import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import Company from './Company';

@Entity('products')
export default class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    companyId: string;

    @ManyToOne(() => Company, company => company.products, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    company: Company;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column()
    brand: string;

    @Column()
    qrCode?: string;

    @Column()
    image?: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
