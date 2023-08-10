import { Controller, Get } from '@nestjs/common';

import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('execute-seed')
  // @Auth()
  executeSeed() {
    return this.seedService.runSeed();
  }
}
