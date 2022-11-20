import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1668930611599 implements MigrationInterface {
    name = 'createTables1668930611599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_11c78d7c145fb2c24ae04b17c0c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_109638590074998bb72a2f2cf08"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_866cb19f6a65b0f57e96099a7db"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_b061bf0c69885f98805da4d7439"`);
        await queryRunner.query(`ALTER TABLE "quests" DROP CONSTRAINT "FK_cd5a7db2e2b6b434e1953b64341"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_f404bc4cead28da5372fc34c9c7"`);
        await queryRunner.query(`ALTER TABLE "rewards" DROP CONSTRAINT "FK_22cb0581caff6e894214cf75a45"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f743964fa589adb2f537040a46"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1ff42886941a20e4854e5b2a1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f58697760e49ed9929e16d173a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c9c69b226e49133ccaab1e750"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37364ba91eb8fd6f079454b14a"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "quests" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "rewards" DROP COLUMN "tenantId"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_48c0c32e6247a2de155baeaf98" ON "teams" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_82df17a5714bbf3df2972a9ae1" ON "penalties" ("title") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5aa96198677df1ba98b8c22b06" ON "quests" ("title") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d5846a5af7df16cfdc23343d83" ON "rewards" ("title") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d5846a5af7df16cfdc23343d83"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5aa96198677df1ba98b8c22b06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_82df17a5714bbf3df2972a9ae1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48c0c32e6247a2de155baeaf98"`);
        await queryRunner.query(`ALTER TABLE "rewards" ADD "tenantId" integer`);
        await queryRunner.query(`ALTER TABLE "requests" ADD "tenant_id" integer`);
        await queryRunner.query(`ALTER TABLE "quests" ADD "tenant_id" integer`);
        await queryRunner.query(`ALTER TABLE "issues" ADD "tenant_id" integer`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD "tenant_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "tenant_id" integer`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "tenant_id" integer`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_37364ba91eb8fd6f079454b14a" ON "rewards" ("title", "tenantId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0c9c69b226e49133ccaab1e750" ON "quests" ("title", "tenant_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f58697760e49ed9929e16d173a" ON "penalties" ("title", "tenant_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c1ff42886941a20e4854e5b2a1" ON "users" ("name", "tenant_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f743964fa589adb2f537040a46" ON "teams" ("name", "tenant_id") `);
        await queryRunner.query(`ALTER TABLE "rewards" ADD CONSTRAINT "FK_22cb0581caff6e894214cf75a45" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_f404bc4cead28da5372fc34c9c7" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quests" ADD CONSTRAINT "FK_cd5a7db2e2b6b434e1953b64341" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_b061bf0c69885f98805da4d7439" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_866cb19f6a65b0f57e96099a7db" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_109638590074998bb72a2f2cf08" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_11c78d7c145fb2c24ae04b17c0c" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
