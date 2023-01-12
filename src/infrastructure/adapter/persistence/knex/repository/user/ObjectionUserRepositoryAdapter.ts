import { Inject } from "@nestjs/common";
import { Optional } from "../../../../../../core/common/type/CommonTypes";
import { User } from "../../../../../../core/domain/user/entity/User";
import { UserRepositoryPort } from "../../../../../../core/domain/user/port/persistence/UserRepositoryPort";
import { ObjectionUserMapper } from "../../entity/user/mapper/ObjectionUserMapper";
import { UserModel } from "../../models/user.model";

export class ObjectionUserRepositoryAdapter implements UserRepositoryPort {
  constructor(
    @Inject(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  async createUser(user: User): Promise<void> {
    const objectionUser = ObjectionUserMapper.toPersistence(user);

    await this.userModel.query().insert({
      ...objectionUser,
    });
  }

  async findUserByUserId(id: string): Promise<User> {
    const queryResult = await this.userModel.query().select().where("id ", id);
    const user = queryResult[0];
    if (queryResult.length < 1) {
      return undefined;
    }
    const domainEntity: Optional<User> =
      ObjectionUserMapper.toDomainEntity(user);
    return domainEntity;
  }

  async findUserByUserEmail(email: string): Promise<User> {
    const queryResult = await this.userModel
      .query()
      .select()
      .where("email ", email);
    if (queryResult.length < 1) {
      return undefined;
    }
    const user = queryResult[0];
    const domainEntity: Optional<User> =
      ObjectionUserMapper.toDomainEntity(user);
    return domainEntity;
  }
}
