import { AuthGuard } from '@nestjs/passport';
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';
import { UserRoleGuard } from '../guards/user-role.guard';
import { METADATA_LABEL } from '../constants';
import { IExtraData, IMetadata } from '../interfaces/auth-decorator';

export function Auth(roles: ValidRoles[], extradata?: IExtraData) {
  const data = extradata;
  const metadataTmp = data?.metadata || {};
  const generateMetadata: IMetadata = {
    roles,
    ...metadataTmp,
  };

  const guardsTmp = data?.guards || [];

  return applyDecorators(
    SetMetadata(METADATA_LABEL, generateMetadata),
    UseGuards(AuthGuard(), UserRoleGuard, ...guardsTmp),
  );
}
