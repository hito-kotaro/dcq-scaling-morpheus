import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1665070361749 implements MigrationInterface {
    name = 'createTables1665070361749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenants" ("id" SERIAL NOT NULL, "tenant_name" character varying NOT NULL, "password" character varying NOT NULL, "season_id" integer NOT NULL DEFAULT '1', "slack_token" character varying NOT NULL DEFAULT '', "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), CONSTRAINT "UQ_5cbe54e309efc7de9cf098223c8" UNIQUE ("tenant_name"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id")); COMMENT ON COLUMN "tenants"."id" IS 'テナントID'; COMMENT ON COLUMN "tenants"."tenant_name" IS 'テナント名'; COMMENT ON COLUMN "tenants"."password" IS 'テナントパスワード'; COMMENT ON COLUMN "tenants"."season_id" IS 'シーズンID'; COMMENT ON COLUMN "tenants"."slack_token" IS 'slack連携トークン'; COMMENT ON COLUMN "tenants"."created_at" IS '登録日時'; COMMENT ON COLUMN "tenants"."updated_at" IS '更新日時'`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "role_name" character varying NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")); COMMENT ON COLUMN "roles"."id" IS 'ロールID'; COMMENT ON COLUMN "roles"."role_name" IS 'ロール名'; COMMENT ON COLUMN "roles"."created_at" IS '登録日時'; COMMENT ON COLUMN "roles"."updated_at" IS '更新日時'`);
        await queryRunner.query(`CREATE TABLE "teams" ("id" SERIAL NOT NULL, "team_name" character varying NOT NULL, "penalty" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "tenant_id" integer, CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id")); COMMENT ON COLUMN "teams"."id" IS 'チームID'; COMMENT ON COLUMN "teams"."team_name" IS 'チーム名'; COMMENT ON COLUMN "teams"."penalty" IS 'ペナルティポイント'; COMMENT ON COLUMN "teams"."created_at" IS '登録日時'; COMMENT ON COLUMN "teams"."updated_at" IS '更新日時'; COMMENT ON COLUMN "teams"."tenant_id" IS 'テナントID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9bef2d3b9ec93aa2471217e57b" ON "teams" ("tenant_id", "team_name") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "point" integer NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "tenantId" integer, "roleId" integer, "teamId" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."created_at" IS '登録日時'; COMMENT ON COLUMN "users"."updated_at" IS '更新日時'; COMMENT ON COLUMN "users"."tenantId" IS 'テナントID'; COMMENT ON COLUMN "users"."roleId" IS 'ロールID'; COMMENT ON COLUMN "users"."teamId" IS 'チームID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_abf9c2fd5b869388f7db6658c3" ON "users" ("tenantId", "name") `);
        await queryRunner.query(`CREATE TABLE "penalties" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "penalty" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" integer, "ownerId" integer, CONSTRAINT "PK_c917b09222ad10103d984fc4e7e" PRIMARY KEY ("id")); COMMENT ON COLUMN "penalties"."id" IS 'ペナルティID'; COMMENT ON COLUMN "penalties"."title" IS 'ペナルティタイトル'; COMMENT ON COLUMN "penalties"."description" IS 'ペナルティ内容'; COMMENT ON COLUMN "penalties"."penalty" IS 'ペナルティポイント'; COMMENT ON COLUMN "penalties"."created_at" IS '登録日時'; COMMENT ON COLUMN "penalties"."updated_at" IS '更新日時'; COMMENT ON COLUMN "penalties"."tenantId" IS 'テナントID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8f29088aabdc506ccdb919e7d4" ON "penalties" ("tenantId", "title") `);
        await queryRunner.query(`CREATE TABLE "issues" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "comment" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" integer, "authorizerId" integer, "teamId" integer, "penaltyId" integer, CONSTRAINT "PK_9d8ecbbeff46229c700f0449257" PRIMARY KEY ("id")); COMMENT ON COLUMN "issues"."id" IS '発行済みペナルティID'; COMMENT ON COLUMN "issues"."title" IS 'ペナルティ付与タイトル'; COMMENT ON COLUMN "issues"."comment" IS 'ペナルティ付与コメント'; COMMENT ON COLUMN "issues"."created_at" IS '登録日時'; COMMENT ON COLUMN "issues"."updated_at" IS '更新日時'; COMMENT ON COLUMN "issues"."tenantId" IS 'テナントID'; COMMENT ON COLUMN "issues"."teamId" IS 'チームID'; COMMENT ON COLUMN "issues"."penaltyId" IS 'ペナルティID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0d0eb0a0f9d9117b760638db17" ON "issues" ("tenantId", "title") `);
        await queryRunner.query(`CREATE TABLE "quests" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "example" text NOT NULL, "reward" integer NOT NULL, "status" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" integer, "ownerId" integer, CONSTRAINT "PK_a037497017b64f530fe09c75364" PRIMARY KEY ("id")); COMMENT ON COLUMN "quests"."id" IS 'クエストID'; COMMENT ON COLUMN "quests"."title" IS 'クエストタイトル'; COMMENT ON COLUMN "quests"."description" IS 'クエスト内容'; COMMENT ON COLUMN "quests"."example" IS 'クエスト報告内容サンプル'; COMMENT ON COLUMN "quests"."reward" IS '獲得ポイント'; COMMENT ON COLUMN "quests"."status" IS 'クエストステータス'; COMMENT ON COLUMN "quests"."created_at" IS '登録日時'; COMMENT ON COLUMN "quests"."updated_at" IS '更新日時'; COMMENT ON COLUMN "quests"."tenantId" IS 'テナントID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b7592eadde75133f32a62ed45a" ON "quests" ("tenantId", "title") `);
        await queryRunner.query(`CREATE TABLE "requests" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" integer, "ownerId" integer, "applicantId" integer, "questId" integer, CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id")); COMMENT ON COLUMN "requests"."id" IS 'リクエストID'; COMMENT ON COLUMN "requests"."title" IS 'リクエストタイトル'; COMMENT ON COLUMN "requests"."description" IS 'リクエスト内容'; COMMENT ON COLUMN "requests"."status" IS 'リクエストステータス'; COMMENT ON COLUMN "requests"."created_at" IS '登録日時'; COMMENT ON COLUMN "requests"."updated_at" IS '更新日時'; COMMENT ON COLUMN "requests"."tenantId" IS 'テナントID'; COMMENT ON COLUMN "requests"."questId" IS 'クエストID'`);
        await queryRunner.query(`CREATE TABLE "rewards" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "point" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" integer, CONSTRAINT "PK_3d947441a48debeb9b7366f8b8c" PRIMARY KEY ("id")); COMMENT ON COLUMN "rewards"."id" IS 'どりかむリストID'; COMMENT ON COLUMN "rewards"."title" IS 'どりかむリストタイトル'; COMMENT ON COLUMN "rewards"."description" IS 'どりかむリスト内容'; COMMENT ON COLUMN "rewards"."point" IS '必要ポイント'; COMMENT ON COLUMN "rewards"."created_at" IS '登録日時'; COMMENT ON COLUMN "rewards"."updated_at" IS '更新日時'; COMMENT ON COLUMN "rewards"."tenantId" IS 'テナントID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_37364ba91eb8fd6f079454b14a" ON "rewards" ("tenantId", "title") `);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_11c78d7c145fb2c24ae04b17c0c" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c58f7e88c286e5e3478960a998b" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_d1803064187c8f38e57a9c4984c" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_1101e7b95ca7ea993c5d671094c" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_e676e1ede33b294c1650054b1fb" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_d1355d5809dd826718a0e49335d" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_349a64063ff5c32b7af629d112f" FOREIGN KEY ("authorizerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_7456d86560ba39425119d567421" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_a2e3d7510dc76f11a75d41d24ea" FOREIGN KEY ("penaltyId") REFERENCES "penalties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quests" ADD CONSTRAINT "FK_5f8facc75490d8d2b7208dc0944" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quests" ADD CONSTRAINT "FK_013a83a6ed812eb6cdaaeb09821" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_4d29ce365f034a30b789cd6a8aa" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_a083267effa7edb60ce371641bd" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_4868d384d0e4163e0e3ee99ba8b" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_e1fd50e6e318b43d3cc8c51f142" FOREIGN KEY ("questId") REFERENCES "quests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rewards" ADD CONSTRAINT "FK_22cb0581caff6e894214cf75a45" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards" DROP CONSTRAINT "FK_22cb0581caff6e894214cf75a45"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_e1fd50e6e318b43d3cc8c51f142"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_4868d384d0e4163e0e3ee99ba8b"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_a083267effa7edb60ce371641bd"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_4d29ce365f034a30b789cd6a8aa"`);
        await queryRunner.query(`ALTER TABLE "quests" DROP CONSTRAINT "FK_013a83a6ed812eb6cdaaeb09821"`);
        await queryRunner.query(`ALTER TABLE "quests" DROP CONSTRAINT "FK_5f8facc75490d8d2b7208dc0944"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_a2e3d7510dc76f11a75d41d24ea"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_7456d86560ba39425119d567421"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_349a64063ff5c32b7af629d112f"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_d1355d5809dd826718a0e49335d"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_e676e1ede33b294c1650054b1fb"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_1101e7b95ca7ea993c5d671094c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d1803064187c8f38e57a9c4984c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c58f7e88c286e5e3478960a998b"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_11c78d7c145fb2c24ae04b17c0c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37364ba91eb8fd6f079454b14a"`);
        await queryRunner.query(`DROP TABLE "rewards"`);
        await queryRunner.query(`DROP TABLE "requests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b7592eadde75133f32a62ed45a"`);
        await queryRunner.query(`DROP TABLE "quests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d0eb0a0f9d9117b760638db17"`);
        await queryRunner.query(`DROP TABLE "issues"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f29088aabdc506ccdb919e7d4"`);
        await queryRunner.query(`DROP TABLE "penalties"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abf9c2fd5b869388f7db6658c3"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9bef2d3b9ec93aa2471217e57b"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
    }

}
