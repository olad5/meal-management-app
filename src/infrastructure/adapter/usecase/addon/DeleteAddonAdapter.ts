import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";
import { UseCaseValidatableAdapter } from "../../../../core/common/adapter/usecase/UseCaseValidatableAdapter";
import { DeleteAddonPort } from "../../../../core/domain/addon/port/usecase/DeleteAddonPort";

@Exclude()
export class DeleteAddonAdapter
  extends UseCaseValidatableAdapter
  implements DeleteAddonPort
{
  @Expose()
  @IsString()
  public brandId: string;

  @Expose()
  @IsString()
  public addonId: string;

  public static async new(
    payload: DeleteAddonPort,
  ): Promise<DeleteAddonAdapter> {
    const adapter: DeleteAddonAdapter = plainToClass(
      DeleteAddonAdapter,
      payload,
    );
    await adapter.validate();

    return adapter;
  }
}
