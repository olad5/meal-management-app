import { UserRole } from "../../../../../../core/common/enums/UserEnums";

export class HttpRestApiCreateUserBody {
  public firstName: string;

  public lastName: string;

  public email: string;

  public role: UserRole;

  public password: string;
}
