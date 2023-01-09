import { get } from 'env-var';

export class ApiServerConfig {
  public static readonly PORT: number = get('API_PORT')
    .required()
    .asPortNumber();
}
