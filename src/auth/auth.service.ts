import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as cookie from 'cookie';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
  public tokenLifeSpan = 2592000;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private _createToken({ username }: User): any {
    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRESIN,
      accessToken,
    };
  }

  async register(user: User) {
    try {
      const existingUser = await User.findOne({ where: { email: user.email } });
      if (existingUser)
        throw new HttpException(
          'Registration failed: Email already registered',
          HttpStatus.CONFLICT,
        );
      const res = await this.userService.create(user);
      return res;
    } catch (err) {
      return { error: 1, message: err.message ?? 'error while creating user' };
    }
    return 'none';
  }

  async login(user: User): Promise<any> {
    try {
      // find user in db
      const userInDB = await this.userService.findByEmail(user.email);
      const isPasswordCorrect: any = await bcrypt.compare(
        user.password,
        userInDB.password,
      );
      if (!isPasswordCorrect) {
        throw new HttpException(
          'Login failed: Incorrect password',
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (!userInDB.isVerified) {
        throw new HttpException(
          'Login failed: Not verified user',
          HttpStatus.UNAUTHORIZED,
        );
      }
      // generate and sign token
      const token = this._createToken(userInDB);
      return {
        username: userInDB.username,
        ...token,
      };
    } catch (e) {
      return {
        error: 1,
        message: e,
      };
    }
  }

  async logout(response: any) {
    response.set(
      'Set-Cookie',
      cookie.serialize('jwt', '', {
        path: '/',
        httpOnly: true,
        maxAge: 1,
      }),
    );
    // await response.redirect('/');
    response.send(true);
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    console.log(`payload`, payload);
    const user = await this.userService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
