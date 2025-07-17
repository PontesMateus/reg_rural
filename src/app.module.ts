import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EstadoModule } from './estado/estado.module';
import { CulturaModule } from './cultura/cultura.module';
import { SafraModule } from './safra/safra.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutorModule } from './produtor/produtor.module';
import { FazendaModule } from './fazenda/fazenda.module';
import { FazendaCulturaSafraModule } from './fazenda-cultura-safra/fazenda-cultura-safra.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    EstadoModule,
    CulturaModule,
    SafraModule,
    AuthModule,
    PrismaModule,
    ProdutorModule,
    FazendaModule,
    FazendaCulturaSafraModule,
  ],
})
export class AppModule { }
