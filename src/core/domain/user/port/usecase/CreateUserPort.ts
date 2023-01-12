import { UserRole } from "../../../../common/enums/UserEnums";

export interface CreateUserPort {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  password: string;
}
