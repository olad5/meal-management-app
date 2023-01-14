import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { UseCaseValidatableAdapter } from "../../../../core/common/adapter/usecase/UseCaseValidatableAdapter";
import { CreateAddonPort } from "../../../../core/domain/addon/port/usecase/CreateAddonPort";

@Exclude()
export class CreateAddonAdapter
  extends UseCaseValidatableAdapter
  implements CreateAddonPort
{
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;

  @Expose()
  @IsNumber()
  public price: number;

  @Expose()
  @IsString()
  public category: string;

  @Expose()
  @IsString()
  public brandId: string;

  public static async new(
    payload: CreateAddonPort,
  ): Promise<CreateAddonAdapter> {
    const adapter: CreateAddonAdapter = plainToClass(
      CreateAddonAdapter,
      payload,
    );
    await adapter.validate();

    return adapter;
  }
}
