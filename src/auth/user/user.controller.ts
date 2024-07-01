import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() dto: SignUpDto) {
    return await this.userService.signUp(dto);
  }

  @Post('/login')
  async login(@Body() dto: LoginDto, @Req() req, @Res() res) {
    return await this.userService.login(dto, req, res);
  }
}
