import { MigrationInterface, QueryRunner } from "typeorm";

export class Records1684080915083 implements MigrationInterface {
    name = 'Records1684080915083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying, "fileName" character varying, "createdAt" bigint NOT NULL, "updatedAt" bigint NOT NULL, "deleted" boolean NOT NULL DEFAULT false, "authorId" uuid NOT NULL, CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "records" ADD CONSTRAINT "FK_447389c0c9dcc190dc22a379e81" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "records" DROP CONSTRAINT "FK_447389c0c9dcc190dc22a379e81"`);
        await queryRunner.query(`DROP TABLE "records"`);
    }

}
