import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";
import { UseCaseValidatableAdapter } from "../../../../core/common/adapter/usecase/UseCaseValidatableAdapter";
import { CreateBrandPort } from "../../../../core/domain/brand/port/usecase/CreateBrandPort";

@Exclude()
export class CreateBrandAdapter
  extends UseCaseValidatableAdapter
  implements CreateBrandPort
{
  @Expose()
  @IsString()
  public name: string;

  public static async new(
    payload: CreateBrandPort,
  ): Promise<CreateBrandAdapter> {
    const adapter: CreateBrandAdapter = plainToClass(
      CreateBrandAdapter,
      payload,
    );
    await adapter.validate();

    return adapter;
  }
}
