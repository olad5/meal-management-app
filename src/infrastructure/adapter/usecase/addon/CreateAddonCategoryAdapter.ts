import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";
import { UseCaseValidatableAdapter } from "../../../../core/common/adapter/usecase/UseCaseValidatableAdapter";
import { CreateAdddonCategoryPort } from "../../../../core/domain/addon/port/usecase/CreateAdddonCategoryPort";

@Exclude()
export class CreateAdddonCategoryAdapter
  extends UseCaseValidatableAdapter
  implements CreateAdddonCategoryPort
{
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public brandId: string;

  public static async new(
    payload: CreateAdddonCategoryPort,
  ): Promise<CreateAdddonCategoryAdapter> {
    const adapter: CreateAdddonCategoryAdapter = plainToClass(
      CreateAdddonCategoryAdapter,
      payload,
    );
    await adapter.validate();

    return adapter;
  }
}
