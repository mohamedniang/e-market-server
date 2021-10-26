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
import { ApplicationService } from './application.service';
import { Application } from './application.entity';
import { Role } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  create(@Body() body: any) {
    const res = Object.assign(new Application(), body);
    return this.applicationService.create(res);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard) // use both guard in the function instead of the class to get req.user and added 'jwt' for challenge bug in authGuard
  @Role('admin')
  findAll() {
    return this.applicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() application: any) {
    console.log('updating application', id, application);
    return this.applicationService.update(id, application);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(+id);
  }
}
