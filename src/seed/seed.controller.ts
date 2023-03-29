import { Controller, Get } from '@nestjs/common';

import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('execute-seed')
  // @Auth()
  executeSeed() {
    return this.seedService.runSeed();
  }
}
