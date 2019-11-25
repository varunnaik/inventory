import { MigrationInterface, QueryRunner } from "typeorm";

export class ShoppingCentre1574483462118 implements MigrationInterface {
  name = "ShoppingCentre1574483462118";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "shopping_centre" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_2562a60f20b71a0310c7323395a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "asset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "dimensions" json NOT NULL, "location" json NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "shoppingcentreId" uuid, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "asset" ADD CONSTRAINT "FK_f98956c91151e34b45ab207542f" FOREIGN KEY ("shoppingcentreId") REFERENCES "shopping_centre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "asset" DROP CONSTRAINT "FK_f98956c91151e34b45ab207542f"`
    );
    await queryRunner.query(`DROP TABLE "asset"`);
    await queryRunner.query(`DROP TABLE "shopping_centre"`);
  }
}
