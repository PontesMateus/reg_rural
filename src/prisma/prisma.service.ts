import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  limparDados() {
    return this.$transaction([
      this.fazendaCulturaSafra.deleteMany(),
      this.fazenda.deleteMany(),
      this.produtor.deleteMany(),
      this.usuario.deleteMany()
    ])
  }
}
