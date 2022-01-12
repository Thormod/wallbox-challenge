import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateChargerModel1642029558506 implements MigrationInterface {
    name = 'GenerateChargerModel1642029558506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "charger" ("serialNumber" uuid NOT NULL DEFAULT uuid_generate_v4(), "battery_level" double precision NOT NULL, "model" character varying NOT NULL, "battery_type" character varying NOT NULL, "injection" character varying NOT NULL, "protection_rating" character varying NOT NULL, "communication_protocol" character varying NOT NULL, "internet_connection" boolean NOT NULL, "supported_voltage" double precision NOT NULL, "kW" double precision NOT NULL, "join_date" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_61522c3e87d87b55ceaae731b92" PRIMARY KEY ("serialNumber"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "charger"`);
    }

}
