import { ConnectionOptions } from "typeorm";
export interface ConfigType {
  jwtSecret: string;
  database: ConnectionOptions;
}

export class Config implements ConfigType {
  public jwtSecret: string;
  public database: any;

  constructor(env: any) {
    this.jwtSecret = env.JWT_SECRET;
    this.database = <ConnectionOptions>{
      type: "postgres",
      host: env.PG_HOST,
      port: env.PG_PORT,
      username: env.PG_USERNAME,
      password: env.PG_PASSWORD,
      database: env.PG_DATABASE,
      entities: [env.TYPEORM_ENTITIES]
    };
  }
}
