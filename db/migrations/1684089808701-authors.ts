import { MigrationInterface, QueryRunner } from "typeorm";

export class Authors1684089808701 implements MigrationInterface {
    name = 'Authors1684089808701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "authors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "username" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" character varying, CONSTRAINT "UQ_e2b6c4a6e9d3cc025af280fc034" UNIQUE ("login"), CONSTRAINT "UQ_0abaae55952d5f8f9f6bfd87372" UNIQUE ("username"), CONSTRAINT "PK_d2ed02fabd9b52847ccb85e6b88" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "authors"`);
    }

}
