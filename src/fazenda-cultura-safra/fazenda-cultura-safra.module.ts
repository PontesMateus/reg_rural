import { Module } from '@nestjs/common';
import { FazendaCulturaSafraController } from './fazenda-cultura-safra.controller';
import { FazendaCulturaSafraService } from './fazenda-cultura-safra.service';

@Module({
  controllers: [FazendaCulturaSafraController],
  providers: [FazendaCulturaSafraService]
})
export class FazendaCulturaSafraModule {}
