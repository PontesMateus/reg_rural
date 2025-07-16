import { Module } from '@nestjs/common';
import { CidadeController } from './cidade.controller';
import { CidadeService } from './cidade.service';

@Module({
  controllers: [CidadeController],
  providers: [CidadeService],
})
export class CidadeModule {}
