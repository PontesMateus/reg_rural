import { Module } from '@nestjs/common';
import { EstadoService } from './estado.service';
import { EstadoController } from './estado.controller';

@Module({
  providers: [EstadoService],
  controllers: [EstadoController]
})
export class EstadoModule {}
