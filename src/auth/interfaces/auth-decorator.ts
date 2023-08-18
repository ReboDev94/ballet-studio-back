import { ValidRoles } from './valid-roles';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomMetadata {}

export interface IExtraData {
  metadata?: ICustomMetadata;
  guards?: any[];
}

export interface IMetadata extends ICustomMetadata {
  roles: ValidRoles[];
}
