import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.entity';

@Injectable()
export class UserService {
  async create(user: User) {
    // check if the user exists in the db
    const userInDb = await User.findOne({
      where: { username: user.username },
    });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    return user.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findByEmail(email: string) {
    console.log(`finding by email ${email}`);
    return User.findOneOrFail({ where: { email } });
  }
  findByPayload({ username }: any) {
    console.log(`finding by payload ${username}`);
    return User.findOneOrFail({ where: { username } });
  }

  update(id: number, user: User) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
