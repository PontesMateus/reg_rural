import { Module } from '@nestjs/common';
import { FazendaController } from './fazenda.controller';
import { FazendaService } from './fazenda.service';

@Module({
  controllers: [FazendaController],
  providers: [FazendaService]
})
export class FazendaModule {}
