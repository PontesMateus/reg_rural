import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EstadoModule } from './estado/estado.module';
import { CulturaModule } from './cultura/cultura.module';
import { SafraModule } from './safra/safra.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ProdutorModule } from './produtor/produtor.module';
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
  ],
})
export class AppModule { }
