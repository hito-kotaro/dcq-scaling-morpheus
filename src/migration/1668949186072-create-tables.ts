import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1668949186072 implements MigrationInterface {
    name = 'createTables1668949186072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "admin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "admin"`);
    }

}
