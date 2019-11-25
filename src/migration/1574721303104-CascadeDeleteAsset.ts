import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeDeleteAsset1574721303104 implements MigrationInterface {
  name = "CascadeDeleteAsset1574721303104";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "asset" DROP CONSTRAINT "FK_f98956c91151e34b45ab207542f"`
    );
    await queryRunner.query(
      `ALTER TABLE "asset" ADD CONSTRAINT "FK_f98956c91151e34b45ab207542f" FOREIGN KEY ("shoppingcentreId") REFERENCES "shopping_centre"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "asset" DROP CONSTRAINT "FK_f98956c91151e34b45ab207542f"`
    );
    await queryRunner.query(
      `ALTER TABLE "asset" ADD CONSTRAINT "FK_f98956c91151e34b45ab207542f" FOREIGN KEY ("shoppingcentreId") REFERENCES "shopping_centre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
