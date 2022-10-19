import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1666136534120 implements MigrationInterface {
    name = 'createTables1666136534120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenants" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "season_id" integer NOT NULL DEFAULT '1', "slack_token" character varying NOT NULL DEFAULT '', "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), CONSTRAINT "UQ_32731f181236a46182a38c992a8" UNIQUE ("name"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id")); COMMENT ON COLUMN "tenants"."id" IS 'テナントID'; COMMENT ON COLUMN "tenants"."name" IS 'テナント名'; COMMENT ON COLUMN "tenants"."password" IS 'テナントパスワード'; COMMENT ON COLUMN "tenants"."season_id" IS 'シーズンID'; COMMENT ON COLUMN "tenants"."slack_token" IS 'slack連携トークン'; COMMENT ON COLUMN "tenants"."created_at" IS '登録日時'; COMMENT ON COLUMN "tenants"."updated_at" IS '更新日時'`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "role_name" character varying NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")); COMMENT ON COLUMN "roles"."id" IS 'ロールID'; COMMENT ON COLUMN "roles"."role_name" IS 'ロール名'; COMMENT ON COLUMN "roles"."created_at" IS '登録日時'; COMMENT ON COLUMN "roles"."updated_at" IS '更新日時'`);
        await queryRunner.query(`CREATE TABLE "teams" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "penalty" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "tenant_id" integer, CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id")); COMMENT ON COLUMN "teams"."id" IS 'チームID'; COMMENT ON COLUMN "teams"."name" IS 'チーム名'; COMMENT ON COLUMN "teams"."penalty" IS 'ペナルティポイント'; COMMENT ON COLUMN "teams"."created_at" IS '登録日時'; COMMENT ON COLUMN "teams"."updated_at" IS '更新日時'; COMMENT ON COLUMN "teams"."tenant_id" IS 'テナントID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f743964fa589adb2f537040a46" ON "teams" ("tenant_id", "name") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "point" integer NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "tenant_id" integer, "role_id" integer, "team_id" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."created_at" IS '登録日時'; COMMENT ON COLUMN "users"."updated_at" IS '更新日時'; COMMENT ON COLUMN "users"."tenant_id" IS 'テナントID'; COMMENT ON COLUMN "users"."role_id" IS 'ロールID'; COMMENT ON COLUMN "users"."team_id" IS 'チームID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c1ff42886941a20e4854e5b2a1" ON "users" ("tenant_id", "name") `);
        await queryRunner.query(`CREATE TABLE "penalties" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "penalty" integer NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "tenant_id" integer, "user_id" integer, CONSTRAINT "PK_c917b09222ad10103d984fc4e7e" PRIMARY KEY ("id")); COMMENT ON COLUMN "penalties"."id" IS 'ペナルティID'; COMMENT ON COLUMN "penalties"."title" IS 'ペナルティタイトル'; COMMENT ON COLUMN "penalties"."description" IS 'ペナルティ内容'; COMMENT ON COLUMN "penalties"."penalty" IS 'ペナルティポイント'; COMMENT ON COLUMN "penalties"."created_at" IS '登録日時'; COMMENT ON COLUMN "penalties"."updated_at" IS '更新日時'; COMMENT ON COLUMN "penalties"."tenant_id" IS 'テナントID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f58697760e49ed9929e16d173a" ON "penalties" ("tenant_id", "title") `);
        await queryRunner.query(`CREATE TABLE "issues" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "tenant_id" integer, "penalty_id" integer, "authorizer_id" integer, "team_id" integer, CONSTRAINT "PK_9d8ecbbeff46229c700f0449257" PRIMARY KEY ("id")); COMMENT ON COLUMN "issues"."id" IS '発行済みペナルティID'; COMMENT ON COLUMN "issues"."title" IS 'ペナルティ付与タイトル'; COMMENT ON COLUMN "issues"."description" IS 'ペナルティ付与コメント'; COMMENT ON COLUMN "issues"."created_at" IS '登録日時'; COMMENT ON COLUMN "issues"."updated_at" IS '更新日時'; COMMENT ON COLUMN "issues"."tenant_id" IS 'テナントID'; COMMENT ON COLUMN "issues"."penalty_id" IS 'ペナルティID'; COMMENT ON COLUMN "issues"."team_id" IS 'チームID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1ac23c2a2a1a682dbb4e547453" ON "issues" ("tenant_id", "title") `);
        await queryRunner.query(`CREATE TABLE "quests" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "example" text NOT NULL, "reward" integer NOT NULL, "status" boolean NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "tenant_id" integer, "user_id" integer, CONSTRAINT "PK_a037497017b64f530fe09c75364" PRIMARY KEY ("id")); COMMENT ON COLUMN "quests"."id" IS 'クエストID'; COMMENT ON COLUMN "quests"."title" IS 'クエストタイトル'; COMMENT ON COLUMN "quests"."description" IS 'クエスト内容'; COMMENT ON COLUMN "quests"."example" IS 'クエスト報告内容サンプル'; COMMENT ON COLUMN "quests"."reward" IS '獲得ポイント'; COMMENT ON COLUMN "quests"."status" IS 'クエストステータス'; COMMENT ON COLUMN "quests"."created_at" IS '登録日時'; COMMENT ON COLUMN "quests"."updated_at" IS '更新日時'; COMMENT ON COLUMN "quests"."tenant_id" IS 'テナントID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0c9c69b226e49133ccaab1e750" ON "quests" ("tenant_id", "title") `);
        await queryRunner.query(`CREATE TABLE "requests" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "tenant_id" integer, "quest_id" integer, "user_id" integer, CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id")); COMMENT ON COLUMN "requests"."id" IS 'リクエストID'; COMMENT ON COLUMN "requests"."title" IS 'リクエストタイトル'; COMMENT ON COLUMN "requests"."description" IS 'リクエスト内容'; COMMENT ON COLUMN "requests"."status" IS 'リクエストステータス'; COMMENT ON COLUMN "requests"."created_at" IS '登録日時'; COMMENT ON COLUMN "requests"."updated_at" IS '更新日時'; COMMENT ON COLUMN "requests"."tenant_id" IS 'テナントID'; COMMENT ON COLUMN "requests"."quest_id" IS 'クエストID'`);
        await queryRunner.query(`CREATE TABLE "rewards" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "point" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" integer, CONSTRAINT "PK_3d947441a48debeb9b7366f8b8c" PRIMARY KEY ("id")); COMMENT ON COLUMN "rewards"."id" IS 'どりかむリストID'; COMMENT ON COLUMN "rewards"."title" IS 'どりかむリストタイトル'; COMMENT ON COLUMN "rewards"."description" IS 'どりかむリスト内容'; COMMENT ON COLUMN "rewards"."point" IS '必要ポイント'; COMMENT ON COLUMN "rewards"."created_at" IS '登録日時'; COMMENT ON COLUMN "rewards"."updated_at" IS '更新日時'; COMMENT ON COLUMN "rewards"."tenantId" IS 'テナントID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_37364ba91eb8fd6f079454b14a" ON "rewards" ("tenantId", "title") `);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_11c78d7c145fb2c24ae04b17c0c" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_109638590074998bb72a2f2cf08" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_866cb19f6a65b0f57e96099a7db" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_e66d336be242cc6a462b3b3fbc5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_b061bf0c69885f98805da4d7439" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_164e6ef058d79d6cb9e57f40e20" FOREIGN KEY ("penalty_id") REFERENCES "penalties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_60034e1041af65281d5b7c7a410" FOREIGN KEY ("authorizer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_cab35132310c94371760eebbc0f" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quests" ADD CONSTRAINT "FK_cd5a7db2e2b6b434e1953b64341" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quests" ADD CONSTRAINT "FK_d2090cad4ae54ac68a622b2fd94" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_f404bc4cead28da5372fc34c9c7" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_5cfb0889398a5790a9bcc71c937" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_9e5e2eb56e3837b43e5a547be23" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rewards" ADD CONSTRAINT "FK_22cb0581caff6e894214cf75a45" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards" DROP CONSTRAINT "FK_22cb0581caff6e894214cf75a45"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_9e5e2eb56e3837b43e5a547be23"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_5cfb0889398a5790a9bcc71c937"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_f404bc4cead28da5372fc34c9c7"`);
        await queryRunner.query(`ALTER TABLE "quests" DROP CONSTRAINT "FK_d2090cad4ae54ac68a622b2fd94"`);
        await queryRunner.query(`ALTER TABLE "quests" DROP CONSTRAINT "FK_cd5a7db2e2b6b434e1953b64341"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_cab35132310c94371760eebbc0f"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_60034e1041af65281d5b7c7a410"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_164e6ef058d79d6cb9e57f40e20"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_b061bf0c69885f98805da4d7439"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_e66d336be242cc6a462b3b3fbc5"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_866cb19f6a65b0f57e96099a7db"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_109638590074998bb72a2f2cf08"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_11c78d7c145fb2c24ae04b17c0c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37364ba91eb8fd6f079454b14a"`);
        await queryRunner.query(`DROP TABLE "rewards"`);
        await queryRunner.query(`DROP TABLE "requests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c9c69b226e49133ccaab1e750"`);
        await queryRunner.query(`DROP TABLE "quests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1ac23c2a2a1a682dbb4e547453"`);
        await queryRunner.query(`DROP TABLE "issues"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f58697760e49ed9929e16d173a"`);
        await queryRunner.query(`DROP TABLE "penalties"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1ff42886941a20e4854e5b2a1"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f743964fa589adb2f537040a46"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
    }

}
