import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body() user: any): Promise<any> {
    console.log(`registering`, user);
    const res = Object.assign(new User(), user);
    const result = await this.authService.register(res);
    if (!result) {
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('login')
  public async login(@Body() user: any): Promise<any> {
    console.log(`logging in`, user);
    const res = Object.assign(new User(), user);
    return await this.authService.login(res);
  }
}
