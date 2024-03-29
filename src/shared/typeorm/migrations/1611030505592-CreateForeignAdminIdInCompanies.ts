import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class CreateForeignAdminIdInCompanies1611030505592
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'companies',
            new TableForeignKey({
                columnNames: ['adminId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onUpdate: 'RESTRICT',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('companies', 'adminId');
    }
}
