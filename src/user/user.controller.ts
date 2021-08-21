import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

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
