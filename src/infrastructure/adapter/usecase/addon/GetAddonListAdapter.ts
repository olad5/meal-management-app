import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";
import { UseCaseValidatableAdapter } from "../../../../core/common/adapter/usecase/UseCaseValidatableAdapter";
import { GetAddonListPort } from "../../../../core/domain/addon/port/usecase/GetAddonListPort";

@Exclude()
export class GetAddonListAdapter
  extends UseCaseValidatableAdapter
  implements GetAddonListPort
{
  @Expose()
  @IsString()
  public brandId: string;

  public static async new(
    payload: GetAddonListPort,
  ): Promise<GetAddonListAdapter> {
    const adapter: GetAddonListAdapter = plainToClass(
      GetAddonListAdapter,
      payload,
    );
    await adapter.validate();

    return adapter;
  }
}
