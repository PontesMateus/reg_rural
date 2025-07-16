import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CidadeModule } from './cidade/cidade.module';
import { EstadoModule } from './estado/estado.module';
import { CulturaModule } from './cultura/cultura.module';
import { SafraModule } from './safra/safra.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CidadeModule,
    EstadoModule,
    CulturaModule,
    SafraModule,
    AuthModule,
    PrismaModule,
  ],
})
export class AppModule { }
