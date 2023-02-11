import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';

export const META_ROLES = 'roles';

export const RoleProtected = (...roles: ValidRoles[]) =>
  SetMetadata(META_ROLES, roles);
