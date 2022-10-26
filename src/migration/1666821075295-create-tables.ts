import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1666821075295 implements MigrationInterface {
    name = 'createTables1666821075295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" ADD "auth_comment" text`);
        await queryRunner.query(`COMMENT ON COLUMN "requests"."auth_comment" IS '承認コメント'`);
        await queryRunner.query(`ALTER TABLE "requests" ADD "authorizer_id" integer`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_ee60fb3b85f3ffd6ac25fcf833a" FOREIGN KEY ("authorizer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_ee60fb3b85f3ffd6ac25fcf833a"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "authorizer_id"`);
        await queryRunner.query(`COMMENT ON COLUMN "requests"."auth_comment" IS '承認コメント'`);
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "auth_comment"`);
    }

}
