import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Role } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body: any) {
    console.log(`req`, body);
    const res = Object.assign(new User(), body.user);
    return this.userService.create(res);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard) // use both guard in the function instead of the class to get req.user and added 'jwt' for challenge bug in authGuard
  @Role('admin')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Get('page/:id')
  findOneMore(@Param('id') id: string) {
    return this.userService.findOneMore(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() user: any) {
    console.log('updating user', id, user);
    return this.userService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
