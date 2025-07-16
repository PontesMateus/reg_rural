import { Module } from '@nestjs/common';
import { SafraService } from './safra.service';
import { SafraController } from './safra.controller';

@Module({
  providers: [SafraService],
  controllers: [SafraController]
})
export class SafraModule {}
