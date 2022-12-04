import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1670034124880 implements MigrationInterface {
    name = 'createTables1670034124880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "point" integer NOT NULL, "admin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."created_at" IS '登録日時'; COMMENT ON COLUMN "users"."updated_at" IS '更新日時'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `);
        await queryRunner.query(`CREATE TABLE "penalties" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "point" integer NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_c917b09222ad10103d984fc4e7e" PRIMARY KEY ("id")); COMMENT ON COLUMN "penalties"."id" IS 'ペナルティID'; COMMENT ON COLUMN "penalties"."title" IS 'ペナルティタイトル'; COMMENT ON COLUMN "penalties"."description" IS 'ペナルティ内容'; COMMENT ON COLUMN "penalties"."point" IS 'ペナルティポイント'; COMMENT ON COLUMN "penalties"."created_at" IS '登録日時'; COMMENT ON COLUMN "penalties"."updated_at" IS '更新日時'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_82df17a5714bbf3df2972a9ae1" ON "penalties" ("title") `);
        await queryRunner.query(`CREATE TABLE "issues" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "penalty_id" integer, "authorizer_id" integer, CONSTRAINT "PK_9d8ecbbeff46229c700f0449257" PRIMARY KEY ("id")); COMMENT ON COLUMN "issues"."id" IS '発行済みペナルティID'; COMMENT ON COLUMN "issues"."title" IS 'ペナルティ付与タイトル'; COMMENT ON COLUMN "issues"."description" IS 'ペナルティ付与コメント'; COMMENT ON COLUMN "issues"."created_at" IS '登録日時'; COMMENT ON COLUMN "issues"."updated_at" IS '更新日時'; COMMENT ON COLUMN "issues"."penalty_id" IS 'ペナルティID'`);
        await queryRunner.query(`CREATE TABLE "lists" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "point" integer NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), CONSTRAINT "PK_268b525e9a6dd04d0685cb2aaaa" PRIMARY KEY ("id")); COMMENT ON COLUMN "lists"."id" IS 'どりかむリストID'; COMMENT ON COLUMN "lists"."title" IS 'どりかむリストタイトル'; COMMENT ON COLUMN "lists"."description" IS 'どりかむリスト内容'; COMMENT ON COLUMN "lists"."point" IS '必要ポイント'; COMMENT ON COLUMN "lists"."created_at" IS '登録日時'; COMMENT ON COLUMN "lists"."updated_at" IS '更新日時'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_31358f5f371eb22e8353a732ca" ON "lists" ("title") `);
        await queryRunner.query(`CREATE TABLE "quests" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "example" text NOT NULL, "reward" integer NOT NULL, "status" boolean NOT NULL, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_a037497017b64f530fe09c75364" PRIMARY KEY ("id")); COMMENT ON COLUMN "quests"."id" IS 'クエストID'; COMMENT ON COLUMN "quests"."title" IS 'クエストタイトル'; COMMENT ON COLUMN "quests"."description" IS 'クエスト内容'; COMMENT ON COLUMN "quests"."example" IS 'クエスト報告内容サンプル'; COMMENT ON COLUMN "quests"."reward" IS '獲得ポイント'; COMMENT ON COLUMN "quests"."status" IS 'クエストステータス'; COMMENT ON COLUMN "quests"."created_at" IS '登録日時'; COMMENT ON COLUMN "quests"."updated_at" IS '更新日時'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5aa96198677df1ba98b8c22b06" ON "quests" ("title") `);
        await queryRunner.query(`CREATE TABLE "requests" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "status" character varying NOT NULL, "auth_comment" text, "created_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now(), "quest_id" integer, "user_id" integer, "authorizer_id" integer, CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id")); COMMENT ON COLUMN "requests"."id" IS 'リクエストID'; COMMENT ON COLUMN "requests"."title" IS 'リクエストタイトル'; COMMENT ON COLUMN "requests"."description" IS 'リクエスト内容'; COMMENT ON COLUMN "requests"."status" IS 'リクエストステータス'; COMMENT ON COLUMN "requests"."auth_comment" IS '承認コメント'; COMMENT ON COLUMN "requests"."created_at" IS '登録日時'; COMMENT ON COLUMN "requests"."updated_at" IS '更新日時'; COMMENT ON COLUMN "requests"."quest_id" IS 'クエストID'`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_e66d336be242cc6a462b3b3fbc5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_164e6ef058d79d6cb9e57f40e20" FOREIGN KEY ("penalty_id") REFERENCES "penalties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_60034e1041af65281d5b7c7a410" FOREIGN KEY ("authorizer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quests" ADD CONSTRAINT "FK_d2090cad4ae54ac68a622b2fd94" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_5cfb0889398a5790a9bcc71c937" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_9e5e2eb56e3837b43e5a547be23" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_ee60fb3b85f3ffd6ac25fcf833a" FOREIGN KEY ("authorizer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_ee60fb3b85f3ffd6ac25fcf833a"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_9e5e2eb56e3837b43e5a547be23"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_5cfb0889398a5790a9bcc71c937"`);
        await queryRunner.query(`ALTER TABLE "quests" DROP CONSTRAINT "FK_d2090cad4ae54ac68a622b2fd94"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_60034e1041af65281d5b7c7a410"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_164e6ef058d79d6cb9e57f40e20"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_e66d336be242cc6a462b3b3fbc5"`);
        await queryRunner.query(`DROP TABLE "requests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5aa96198677df1ba98b8c22b06"`);
        await queryRunner.query(`DROP TABLE "quests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_31358f5f371eb22e8353a732ca"`);
        await queryRunner.query(`DROP TABLE "lists"`);
        await queryRunner.query(`DROP TABLE "issues"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_82df17a5714bbf3df2972a9ae1"`);
        await queryRunner.query(`DROP TABLE "penalties"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
