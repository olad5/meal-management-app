import { Code } from "../code/Code";
import { Nullable } from "../type/CommonTypes";

export class CoreApiResponse<TData> {
  public readonly code: number;

  public readonly message: string;

  public readonly timestamp: number;

  public readonly data: Nullable<TData>;
  public readonly stackTrace: string;

  private constructor(
    code: number,
    message: string,
    data?: TData,
    stackTrace?: string,
  ) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.stackTrace = stackTrace;
    this.timestamp = Date.now();
  }

  public static success<TData>(
    data?: TData,
    message?: string,
  ): CoreApiResponse<TData> {
    const resultCode: number = Code.SUCCESS.code;
    const resultMessage: string = message || Code.SUCCESS.message;

    return new CoreApiResponse(resultCode, resultMessage, data);
  }

  public static error<TData>(
    code?: number,
    message?: string,
    data?: TData,
    stackTrace?: string,
  ): CoreApiResponse<TData> {
    const resultCode: number = code || Code.INTERNAL_ERROR.code;
    const resultMessage: string = message || Code.INTERNAL_ERROR.message;

    return new CoreApiResponse(resultCode, resultMessage, data, stackTrace);
  }
}
