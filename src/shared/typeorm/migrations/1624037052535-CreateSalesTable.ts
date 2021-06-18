import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSalesTable1624037052535 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        await queryRunner.createTable(
            new Table({
                name: 'sales',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isGenerated: true,
                        generationStrategy: 'uuid',
                        isPrimary: true,
                        isUnique: true,
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'companyId',
                        type: 'uuid',
                    },
                    {
                        name: 'employeeId',
                        type: 'uuid',
                    },
                    {
                        name: 'productId',
                        type: 'uuid',
                    },
                    {
                        name: 'date',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'type',
                        type: 'varchar',
                    },
                    {
                        name: 'quantity',
                        type: 'serial',
                    },
                    {
                        name: 'totalPrice',
                        type: 'numeric',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'companyId',
                        columnNames: ['companyId'],
                        referencedTableName: 'companies',
                        referencedColumnNames: ['id'],
                        onUpdate: 'RESTRICT',
                        onDelete: 'CASCADE',
                    },
                    {
                        name: 'employeeId',
                        columnNames: ['employeeId'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onUpdate: 'CASCADE',
                        onDelete: 'RESTRICT',
                    },
                    {
                        name: 'productId',
                        columnNames: ['productId'],
                        referencedTableName: 'products',
                        referencedColumnNames: ['id'],
                        onUpdate: 'CASCADE',
                        onDelete: 'RESTRICT',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('sales');
    }
}
