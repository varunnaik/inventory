import { ConnectionOptions } from "typeorm";
export interface ConfigType {
  jwtSecret: string;
  port: number;
  database: ConnectionOptions;
}

export class Config implements ConfigType {
  public jwtSecret: string;
  public port: number;
  public database: any;

  constructor(env: any) {
    this.jwtSecret = env.JWT_SECRET;
    this.port = env.PORT;
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
