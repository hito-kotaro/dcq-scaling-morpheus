import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1666914566533 implements MigrationInterface {
    name = 'createTables1666914566533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1ac23c2a2a1a682dbb4e547453"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1ac23c2a2a1a682dbb4e547453" ON "issues" ("title", "tenant_id") `);
    }

}
