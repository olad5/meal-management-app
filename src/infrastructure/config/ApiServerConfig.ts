import { get } from "env-var";

export class ApiServerConfig {
  public static readonly PORT: number = get("API_PORT")
    .required()
    .asPortNumber();

  public static readonly LOG_ENABLE: boolean = get("API_LOG_ENABLE")
    .required()
    .asBool();
}
