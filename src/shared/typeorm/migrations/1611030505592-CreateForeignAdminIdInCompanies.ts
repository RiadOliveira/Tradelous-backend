import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class CreateForeignAdminIdInCompanies1611030505592
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'companies',
            new TableForeignKey({
                columnNames: ['adminID'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('companies', 'adminID');
    }
}
