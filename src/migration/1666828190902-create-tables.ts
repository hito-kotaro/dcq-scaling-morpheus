import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1666828190902 implements MigrationInterface {
    name = 'createTables1666828190902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "penalties" RENAME COLUMN "penalty" TO "point"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "penalties" RENAME COLUMN "point" TO "penalty"`);
    }

}
