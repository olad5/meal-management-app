import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from "@nestjs/common";
import { CoreApiResponse } from "../../../../core/common/api/CoreApiResponse";
import { UserDITokens } from "../../../../core/domain/user/di/UserDITokens";
import { CreateUserUseCase } from "../../../../core/domain/user/usecase/CreateUserUseCase";
import { UserUseCaseDto } from "../../../../core/domain/user/usecase/dto/UserUseCaseDto";
import { CreateUserAdapter } from "../../../../infrastructure/adapter/usecase/user/CreateUserAdapter";
import { HttpRestApiCreateUserBody } from "./request/user/HttpRestCreateUserBody";

@Controller("users")
export class UserController {
  constructor(
    @Inject(UserDITokens.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post("")
  @HttpCode(HttpStatus.OK)
  public async createAccount(
    @Body() body: HttpRestApiCreateUserBody,
  ): Promise<CoreApiResponse<UserUseCaseDto>> {
    const adapter: CreateUserAdapter = await CreateUserAdapter.new({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      role: body.role,
      password: body.password,
    });

    const createdUser: UserUseCaseDto = await this.createUserUseCase.execute(
      adapter,
    );

    return CoreApiResponse.success<UserUseCaseDto>(createdUser);
  }
}
