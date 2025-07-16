import { Module } from '@nestjs/common';
import { ProdutorService } from './produtor.service';
import { ProdutorController } from './produtor.controller';

@Module({
  providers: [ProdutorService],
  controllers: [ProdutorController]
})
export class ProdutorModule {}
