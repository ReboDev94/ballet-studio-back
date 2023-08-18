import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { User } from 'src/auth/entities';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  teacher?: User;
}
