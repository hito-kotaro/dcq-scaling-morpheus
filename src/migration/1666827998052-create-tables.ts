import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1666827998052 implements MigrationInterface {
    name = 'createTables1666827998052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "penalties" ADD "auth_comment" text`);
        await queryRunner.query(`COMMENT ON COLUMN "penalties"."auth_comment" IS '承認コメント'`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD "team_id" integer`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD "authorizer_id" integer`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_bbe764f4e61dcee04fc1d1d8af8" FOREIGN KEY ("team_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_3ed4635062f6970efce2313cd9e" FOREIGN KEY ("authorizer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_3ed4635062f6970efce2313cd9e"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_bbe764f4e61dcee04fc1d1d8af8"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP COLUMN "authorizer_id"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP COLUMN "team_id"`);
        await queryRunner.query(`COMMENT ON COLUMN "penalties"."auth_comment" IS '承認コメント'`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP COLUMN "auth_comment"`);
    }

}
