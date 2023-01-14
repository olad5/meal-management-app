import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Code } from "../../../../../core/common/code/Code";
import { Exception } from "../../../../../core/common/exception/Exception";
import { CoreAssert } from "../../../../../core/common/util/assert/CoreAssert";
import { HttpAuthService } from "../HttpAuthService";
import { HttpUserPayload } from "../type/HttpAuthTypes";

@Injectable()
export class HttpLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: HttpAuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  public async validate(
    email: string,
    password: string,
  ): Promise<HttpUserPayload> {
    const user: HttpUserPayload = CoreAssert.notEmpty(
      await this.authService.validateUser(email, password),
      Exception.new({ code: Code.WRONG_CREDENTIALS_ERROR }),
    );

    return user;
  }
}
