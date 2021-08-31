import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async isMember(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('inside isMember()', request.user);
    return request.user;
  }

  async isMemberVIP(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('inside isMemberVIP()', request.user);
    return request.user && request.user.role && request.user.role.id === 3;
  }

  async isAdmin(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('inside isAdmin()', request.user);
    return request.user && request.user.role && request.user.role.id === 1;
  }

  async canActivate(context: ExecutionContext) {
    const role = this.reflector.get<string>('role', context.getHandler());
    console.log('inside role guard', role);
    if (!role) return true;
    if (role == 'admin') {
      const r = await this.isAdmin(context);
      if (r) return true;
    }
    if (role == 'member') {
      const r = await this.isMember(context);
      if (r) return true;
    }
    if (role == 'vip') {
      const r = await this.isMemberVIP(context);
      if (r) return true;
    }
    return false;
  }
}
