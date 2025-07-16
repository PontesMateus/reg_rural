import { Module } from '@nestjs/common';
import { CulturaService } from './cultura.service';
import { CulturaController } from './cultura.controller';

@Module({
  providers: [CulturaService],
  controllers: [CulturaController],
})
export class CulturaModule {}
