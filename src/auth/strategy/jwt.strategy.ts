
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    const secret = config.get('TOKEN_SECRET');
    if (!secret) {
      throw new Error('TOKEN_SECRET não definido nas variáveis de ambiente!');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const usuarioToken = await this.prisma.usuario.findUnique({
      where: {
        usuario_id: payload.sub
      }
    })
    if (usuarioToken) {
      usuarioToken.hash = '';
    }
    return usuarioToken;
  }
}