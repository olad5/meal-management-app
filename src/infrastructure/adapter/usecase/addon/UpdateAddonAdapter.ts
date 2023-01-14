import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";
import { UseCaseValidatableAdapter } from "../../../../core/common/adapter/usecase/UseCaseValidatableAdapter";
import { UpdateAddonPort } from "../../../../core/domain/addon/port/usecase/UpdateAddonPort";

@Exclude()
export class UpdateAddonAdapter
  extends UseCaseValidatableAdapter
  implements UpdateAddonPort
{
  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose()
  public price: number;

  @Expose()
  public category: string;

  @Expose()
  @IsString()
  public addonId: string;

  @Expose()
  @IsString()
  public brandId: string;

  public static async new(
    payload: UpdateAddonPort,
  ): Promise<UpdateAddonAdapter> {
    const adapter: UpdateAddonAdapter = plainToClass(
      UpdateAddonAdapter,
      payload,
    );
    await adapter.validate();

    return adapter;
  }
}
