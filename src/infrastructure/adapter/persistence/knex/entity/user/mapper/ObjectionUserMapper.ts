import { UserRole } from "../../../../../../../core/common/enums/UserEnums";
import { User } from "../../../../../../../core/domain/user/entity/User";
import { ObjectionUser, UserModel } from "../../../models/user.model";

export class ObjectionUserMapper {
  public static toPersistence(domainUser: User): ObjectionUser {
    const objectionUser: ObjectionUser = {
      id: domainUser.getId(),
      email: domainUser.getEmail(),
      last_name: domainUser.getLastName(),
      first_name: domainUser.getFirstName(),
      role: domainUser.getRole(),
      password: domainUser.getPassword(),
    };
    return objectionUser;
  }

  public static toDomainEntity(knexUser: UserModel): User {
    const domainUser: User = new User({
      id: knexUser.id,
      firstName: knexUser.first_name,
      lastName: knexUser.last_name,
      email: knexUser.email,
      role: knexUser.role as UserRole,
      password: knexUser.password,
    });

    return domainUser;
  }
}
