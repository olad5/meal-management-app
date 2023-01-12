import { Code } from "../../../common/code/Code";
import { Exception } from "../../../common/exception/Exception";
import { CoreAssert } from "../../../common/util/assert/CoreAssert";
import { User } from "../../../domain/user/entity/User";
import { UserRepositoryPort } from "../../../domain/user/port/persistence/UserRepositoryPort";
import { CreateUserPort } from "../../../domain/user/port/usecase/CreateUserPort";
import { CreateUserUseCase } from "../../../domain/user/usecase/CreateUserUseCase";
import { UserUseCaseDto } from "../../../domain/user/usecase/dto/UserUseCaseDto";

export class CreateUserService implements CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  public async execute(payload: CreateUserPort): Promise<UserUseCaseDto> {
    const doesUserExist = !!(await this.userRepository.findUserByUserEmail(
      payload.email,
    ));
    CoreAssert.isFalse(
      doesUserExist,
      Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: "User already exists.",
      }),
    );

    const user: User = await User.new({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: payload.role,
      password: payload.password,
    });

    await this.userRepository.createUser(user);

    return UserUseCaseDto.newFromUser(user);
  }
}
