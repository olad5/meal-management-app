import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CoreApiResponse } from "../../../../core/common/api/CoreApiResponse";
import { HttpLocalAuthGuard } from "../auth/guard/HttpLocalAuthGuard";
import { HttpAuthService } from "../auth/HttpAuthService";
import {
  HttpLoggedInUser,
  HttpRequestWithUser,
} from "../auth/type/HttpAuthTypes";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: HttpAuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpLocalAuthGuard)
  public async login(
    @Req() request: HttpRequestWithUser,
  ): Promise<CoreApiResponse<HttpLoggedInUser>> {
    return CoreApiResponse.success(this.authService.login(request.user));
  }
}
