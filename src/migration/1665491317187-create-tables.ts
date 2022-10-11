import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1665491317187 implements MigrationInterface {
    name = 'createTables1665491317187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_1101e7b95ca7ea993c5d671094c"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_e676e1ede33b294c1650054b1fb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f29088aabdc506ccdb919e7d4"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP COLUMN "tenantId"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD "tenant_id" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "penalties"."tenant_id" IS 'テナントID'`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "penalties" ALTER COLUMN "created_at" TYPE TIMESTAMP(0)`);
        await queryRunner.query(`ALTER TABLE "penalties" ALTER COLUMN "updated_at" TYPE TIMESTAMP(0)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f58697760e49ed9929e16d173a" ON "penalties" ("tenant_id", "title") `);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_866cb19f6a65b0f57e96099a7db" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_e66d336be242cc6a462b3b3fbc5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_e66d336be242cc6a462b3b3fbc5"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_866cb19f6a65b0f57e96099a7db"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f58697760e49ed9929e16d173a"`);
        await queryRunner.query(`ALTER TABLE "penalties" ALTER COLUMN "updated_at" TYPE TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "penalties" ALTER COLUMN "created_at" TYPE TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP COLUMN "user_id"`);
        await queryRunner.query(`COMMENT ON COLUMN "penalties"."tenant_id" IS 'テナントID'`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD "tenantId" integer`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8f29088aabdc506ccdb919e7d4" ON "penalties" ("title", "tenantId") `);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_e676e1ede33b294c1650054b1fb" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_1101e7b95ca7ea993c5d671094c" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
