import { Config, ConfigType } from "../types/app/Config";

export function getConfig(env: any): ConfigType {
  return new Config(env);
}
