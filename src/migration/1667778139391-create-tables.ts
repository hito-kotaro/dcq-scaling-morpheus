import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1667778139391 implements MigrationInterface {
    name = 'createTables1667778139391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" ADD "point" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "teams"."point" IS 'ポイント'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "teams"."point" IS 'ポイント'`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "point"`);
    }

}
