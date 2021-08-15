import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  // @Roles('User')
  async get(@Req() req) {
    console.log(`req.body`, req.user);
    return await this.userService.findByPayload(req.user);
  }

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
  public async login(@Body() user: any, @Req() req, @Res() response: Response) {
    console.log(`logging in`, user);
    try {
      const userFormat = Object.assign(new User(), user);
      const res = await this.authService.login(userFormat);
      const { username } = res;
      if (res?.error) {
        response.json(res);
        return;
      }
      response.cookie('jwt', res.accessToken, {
        path: '/',
        httpOnly: true,
        maxAge: this.authService.tokenLifeSpan,
      });
      // response.setHeader('Access-Control-Allow-Credentials', 'true');
      // console.log(response);
      response.json({ username });
    } catch (error) {
      console.error(error);
    }
  }

  @Get('logout')
  public async logout(@Res() res) {
    console.log(`logging out`);
    return await this.authService.logout(res);
  }
}
