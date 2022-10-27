import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1666828252084 implements MigrationInterface {
    name = 'createTables1666828252084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_bbe764f4e61dcee04fc1d1d8af8"`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD "penalty_id" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "penalties"."penalty_id" IS 'ペナルティID'`);
        await queryRunner.query(`COMMENT ON COLUMN "penalties"."team_id" IS 'チームID'`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_deceef9b93b9028376ae1f5c093" FOREIGN KEY ("penalty_id") REFERENCES "penalties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_bbe764f4e61dcee04fc1d1d8af8" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_bbe764f4e61dcee04fc1d1d8af8"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_deceef9b93b9028376ae1f5c093"`);
        await queryRunner.query(`COMMENT ON COLUMN "penalties"."team_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "penalties"."penalty_id" IS 'ペナルティID'`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP COLUMN "penalty_id"`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_bbe764f4e61dcee04fc1d1d8af8" FOREIGN KEY ("team_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
