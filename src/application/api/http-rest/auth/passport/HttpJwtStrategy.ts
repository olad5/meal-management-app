import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Code } from "../../../../../core/common/code/Code";
import { Exception } from "../../../../../core/common/exception/Exception";
import { CoreAssert } from "../../../../../core/common/util/assert/CoreAssert";
import { User } from "../../../../../core/domain/user/entity/User";
import { ApiServerConfig } from "../../../../../infrastructure/config/ApiServerConfig";
import { HttpAuthService } from "../HttpAuthService";
import { HttpJwtPayload, HttpUserPayload } from "../type/HttpAuthTypes";

@Injectable()
export class HttpJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: HttpAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ApiServerConfig.ACCESS_TOKEN_SECRET,
    });
  }

  public async validate(payload: HttpJwtPayload): Promise<HttpUserPayload> {
    const user: User = CoreAssert.notEmpty(
      await this.authService.getUser(payload.id),
      Exception.new({ code: Code.UNAUTHORIZED_ERROR }),
    );

    return { id: user.getId(), email: user.getEmail(), role: user.getRole() };
  }
}
