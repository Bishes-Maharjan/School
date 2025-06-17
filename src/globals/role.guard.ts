/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Global,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';

@Global()
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>( //basically gets the string within the decorator
      ROLES_KEY, // makes sure its a role decorator
      [context.getHandler(), context.getClass()], //first takes the class then the controller
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const role = request.headers['x-role']; // dummy role header

    if (!role || !requiredRoles.includes(role.toLowerCase())) {
      throw new ForbiddenException('Access denied. Role not authorized.');
    }

    return true;
  }
}
