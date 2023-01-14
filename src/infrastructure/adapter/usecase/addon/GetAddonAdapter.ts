import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";
import { UseCaseValidatableAdapter } from "../../../../core/common/adapter/usecase/UseCaseValidatableAdapter";
import { GetAddonPort } from "../../../../core/domain/addon/port/usecase/GetAddonPort";

@Exclude()
export class GetAddonAdapter
  extends UseCaseValidatableAdapter
  implements GetAddonPort
{
  @Expose()
  @IsString()
  public brandId: string;

  @Expose()
  @IsString()
  public addonId: string;

  public static async new(payload: GetAddonPort): Promise<GetAddonAdapter> {
    const adapter: GetAddonAdapter = plainToClass(GetAddonAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}
