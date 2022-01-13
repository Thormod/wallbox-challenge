import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateChargerModel1642036591687 implements MigrationInterface {
    name = 'GenerateChargerModel1642036591687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "charger" ("serial_number" uuid NOT NULL DEFAULT uuid_generate_v4(), "battery_level" double precision NOT NULL, "model" character varying NOT NULL, "battery_type" character varying NOT NULL, "injection" character varying NOT NULL, "protection_rating" character varying NOT NULL, "communication_protocol" character varying NOT NULL, "internet_connection" boolean NOT NULL, "supported_voltage" double precision NOT NULL, "kw" double precision NOT NULL, "join_date" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_b722c0ea89097558878f44129c1" PRIMARY KEY ("serial_number"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "charger"`);
    }

}
