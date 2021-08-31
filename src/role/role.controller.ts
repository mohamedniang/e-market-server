import { Controller, Get } from '@nestjs/common';
import { Role } from './role.entity';
@Controller('role')
export class RoleController {
  @Get()
  async getAllRoles() {
    return await Role.find();
  }
}
