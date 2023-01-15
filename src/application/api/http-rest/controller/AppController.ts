import { Controller, HttpCode, HttpStatus } from "@nestjs/common";
import { Get } from "@nestjs/common";

@Controller("")
export class AppController {
  @Get("")
  @HttpCode(HttpStatus.OK)
  public async home(): Promise<{ message: string }> {
    return { message: "Server running...." };
  }
}
