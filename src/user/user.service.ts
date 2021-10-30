import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from 'src/role/role.entity';
import { User } from './user.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

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
    user.role = new Role();
    user.role.id = 2;
    return user.save();
  }

  async findAll() {
    return await User.find({
      relations: ['role'],
      select: [
        'id',
        'username',
        'email',
        'role',
        'password',
        'fullname',
        'company',
        'address',
        'country',
        'city',
        'state',
        'phone',
        'fax',
        'website',
        'isVerified',
        'created_at',
        'updated_at',
      ],
    });
  }

  async findOne(id: string) {
    console.log(`finding by #${id} user`);
    return await User.findOne({ where: { id }, relations: ['role'] });
  }
  async findOneMore(id: string) {
    return await User.findOne({
      where: { id },
      select: [
        'username',
        'email',
        'fullname',
        'company',
        'address',
        'country',
        'city',
        'state',
        'phone',
        'fax',
        'website',
        'created_at',
      ],
    });
  }

  async findByEmail(email: string) {
    console.log(`finding by email ${email}`);
    try {
      const res = await User.findOneOrFail({
        where: { email },
        select: ['id', 'username', 'email', 'password', 'isVerified', 'role'],
        relations: ['role'],
      });
      return res;
    } catch (e) {
      throw new HttpException('Email not registered', HttpStatus.UNAUTHORIZED);
    }
  }

  findByPayload({ username }: any) {
    console.log(`finding by payload ${username}`);
    return User.findOneOrFail({
      where: { username },
      select: ['id', 'username', 'email', 'password', 'role'],
      relations: ['role'],
    });
  }

  async update(id: string, user: any) {
    console.log(`This action updates a #${id} user`, user);
    const newUser = new User();
    newUser.id = id;
    if (user && user.password)
      user.password = await bcrypt.hash(user.password, 10);
    return await Object.assign(newUser, user).save();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
