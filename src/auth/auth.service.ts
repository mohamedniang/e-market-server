import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private _createToken({ username }: User): any {
    const user: JwtPayload = { username };
    console.log('secret', process.env.SECRETKEY);
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRESIN,
      accessToken,
    };
  }

  async register(user: User) {
    try {
      const res = await this.userService.create(user);
      return res;
    } catch (err) {
      return 'error while creating user';
    }
    return 'none';
  }

  async login(user: User): Promise<any> {
    // find user in db
    const userInDB = await this.userService.findByEmail(user.email);
    const isPasswordCorrect: any = await bcrypt.compare(
      user.password,
      userInDB.password,
    );
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
    // generate and sign token
    const token = this._createToken(userInDB);

    return {
      username: userInDB.username,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
