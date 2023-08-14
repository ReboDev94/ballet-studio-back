import { AuthGuard } from '@nestjs/passport';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';
import { UserRoleGuard } from '../guards/user-role.guard';
import {
  ICustomMetadata,
  IExtraData,
  IMetadata,
} from '../interfaces/auth-decorator';
import { MetadataProtected } from './metadata-protected.decorator';

export function Auth(roles: ValidRoles[], extradata?: IExtraData) {
  const data = extradata;
  const metadataTmp = data?.metadata || ({} as ICustomMetadata);
  const generateMetadata: IMetadata = {
    roles,
    ...metadataTmp,
  };

  const guardsTmp = data?.guards || [];

  return applyDecorators(
    MetadataProtected(generateMetadata),
    UseGuards(AuthGuard(), UserRoleGuard, ...guardsTmp),
  );
}
