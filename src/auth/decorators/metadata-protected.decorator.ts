import { SetMetadata } from '@nestjs/common';
import { IMetadata } from '../interfaces/auth-decorator';
import { METADATA_LABEL } from '../constants';

export const MetadataProtected = (metadata: IMetadata) =>
  SetMetadata(METADATA_LABEL, metadata);
