import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { AuthenticationService } from "./authentication.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller('auth')
export class AuthenticationController {
  constructor (
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post('register')
  public async register(@Body() dto: CreateUserDto) {
    const newUser = await this.authenticationService.register(dto);
    return newUser.toPOJO();
  }

  @Post('login')
  public async login(@Body() dto: LoginUserDto) {
    const verifiedUser = await this.authenticationService.verifyUser(dto);
    return verifiedUser.toPOJO();
  }

  @Get(':id')
  public async get(@Param('id') id: string) {
    const existUser = await this.authenticationService.getUser(id);
    return existUser.toPOJO();
  }
}
