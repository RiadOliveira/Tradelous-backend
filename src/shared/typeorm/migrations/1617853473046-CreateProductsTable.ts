import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductsTable1617853473046 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        await queryRunner.createTable(
            new Table({
                name: 'products',
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
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'companyId',
                        type: 'uuid',
                    },
                    {
                        name: 'price',
                        type: 'numeric',
                    },
                    {
                        name: 'quantity',
                        type: 'serial',
                    },
                    {
                        name: 'brand',
                        type: 'varchar',
                    },
                    {
                        name: 'barCode',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'image',
                        type: 'varchar',
                        isNullable: true,
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
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('products');
    }
}
