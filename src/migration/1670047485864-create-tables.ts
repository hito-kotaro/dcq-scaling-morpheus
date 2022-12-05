import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1670047485864 implements MigrationInterface {
    name = 'createTables1670047485864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lists" ADD "created_by" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "lists"."created_by" IS '登録者'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "lists"."created_by" IS '登録者'`);
        await queryRunner.query(`ALTER TABLE "lists" DROP COLUMN "created_by"`);
    }

}
