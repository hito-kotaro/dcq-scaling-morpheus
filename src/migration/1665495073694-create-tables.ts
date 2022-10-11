import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1665495073694 implements MigrationInterface {
    name = 'createTables1665495073694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_d1355d5809dd826718a0e49335d"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_349a64063ff5c32b7af629d112f"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_7456d86560ba39425119d567421"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_a2e3d7510dc76f11a75d41d24ea"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d0eb0a0f9d9117b760638db17"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP COLUMN "tenantId"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP COLUMN "authorizerId"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP COLUMN "penaltyId"`);
        await queryRunner.query(`ALTER TABLE "issues" ADD "tenant_id" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "issues"."tenant_id" IS 'テナントID'`);
        await queryRunner.query(`ALTER TABLE "issues" ADD "penalty_id" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "issues"."penalty_id" IS 'ペナルティID'`);
        await queryRunner.query(`ALTER TABLE "issues" ADD "authorizer_id" integer`);
        await queryRunner.query(`ALTER TABLE "issues" ADD "team_id" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "issues"."team_id" IS 'チームID'`);
        await queryRunner.query(`ALTER TABLE "issues" ALTER COLUMN "created_at" TYPE TIMESTAMP(0)`);
        await queryRunner.query(`ALTER TABLE "issues" ALTER COLUMN "updated_at" TYPE TIMESTAMP(0)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1ac23c2a2a1a682dbb4e547453" ON "issues" ("tenant_id", "title") `);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_b061bf0c69885f98805da4d7439" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_164e6ef058d79d6cb9e57f40e20" FOREIGN KEY ("penalty_id") REFERENCES "penalties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_60034e1041af65281d5b7c7a410" FOREIGN KEY ("authorizer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_cab35132310c94371760eebbc0f" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_cab35132310c94371760eebbc0f"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_60034e1041af65281d5b7c7a410"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_164e6ef058d79d6cb9e57f40e20"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_b061bf0c69885f98805da4d7439"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1ac23c2a2a1a682dbb4e547453"`);
        await queryRunner.query(`ALTER TABLE "issues" ALTER COLUMN "updated_at" TYPE TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "issues" ALTER COLUMN "created_at" TYPE TIMESTAMP(6)`);
        await queryRunner.query(`COMMENT ON COLUMN "issues"."team_id" IS 'チームID'`);
        await queryRunner.query(`ALTER TABLE "issues" DROP COLUMN "team_id"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP COLUMN "authorizer_id"`);
        await queryRunner.query(`COMMENT ON COLUMN "issues"."penalty_id" IS 'ペナルティID'`);
        await queryRunner.query(`ALTER TABLE "issues" DROP COLUMN "penalty_id"`);
        await queryRunner.query(`COMMENT ON COLUMN "issues"."tenant_id" IS 'テナントID'`);
        await queryRunner.query(`ALTER TABLE "issues" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "issues" ADD "penaltyId" integer`);
        await queryRunner.query(`ALTER TABLE "issues" ADD "teamId" integer`);
        await queryRunner.query(`ALTER TABLE "issues" ADD "authorizerId" integer`);
        await queryRunner.query(`ALTER TABLE "issues" ADD "tenantId" integer`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0d0eb0a0f9d9117b760638db17" ON "issues" ("title", "tenantId") `);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_a2e3d7510dc76f11a75d41d24ea" FOREIGN KEY ("penaltyId") REFERENCES "penalties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_7456d86560ba39425119d567421" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_349a64063ff5c32b7af629d112f" FOREIGN KEY ("authorizerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_d1355d5809dd826718a0e49335d" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
