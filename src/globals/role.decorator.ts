// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLES_ENUM[]) => SetMetadata(ROLES_KEY, roles);

export enum ROLES_ENUM {
  TEACHER = 'teacher', //can add more depending on the case like admin editor student ,
  //  but wont matter much cuz student ,teacher cant have roles and rbac is done based on headers as requested
}
