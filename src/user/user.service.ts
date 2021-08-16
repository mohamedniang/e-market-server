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

  async findOne(id: string) {
    console.log(`finding by #${id} user`);
    return await User.findOne(id);
  }

  findByEmail(email: string) {
    console.log(`finding by email ${email}`);
    return User.findOneOrFail({
      where: { email },
      select: ['id', 'username', 'email', 'password'],
    });
  }
  findByPayload({ username }: any) {
    console.log(`finding by payload ${username}`);
    return User.findOneOrFail({
      where: { username },
      select: ['id', 'username', 'email', 'password'],
    });
  }

  update(id: number, user: User) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
