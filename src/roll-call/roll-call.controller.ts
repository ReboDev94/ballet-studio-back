import { Controller } from '@nestjs/common';
import { RollCallService } from './roll-call.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Auth(ValidRoles.admin, ValidRoles.teacher)
@Controller('roll-call')
export class RollCallController {
  constructor(private readonly rollCallService: RollCallService) {}
}
