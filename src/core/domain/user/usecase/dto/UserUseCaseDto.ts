import { Exclude, Expose, plainToClass } from "class-transformer";
import { UserRole } from "../../../../common/enums/UserEnums";
import { User } from "../../entity/User";

@Exclude()
export class UserUseCaseDto {
  @Expose()
  public id: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;

  @Expose()
  public email: string;

  @Expose()
  public role: UserRole;

  public static newFromUser(user: User): UserUseCaseDto {
    return plainToClass(UserUseCaseDto, user);
  }
}
