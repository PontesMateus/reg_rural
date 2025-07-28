import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ErrorMessages } from '../../common/constants/error-messages.constant';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }
  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.usuario_senha);
    try {
      const usuario = await this.prisma.usuario.create({
        data: {
          email: dto.usuario_email,
          hash,
        },
      });
      return this.signToken(usuario.usuario_id, usuario.email);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          //! Tratativa duplicate key
          throw new ForbiddenException(ErrorMessages.USUARIO.EMAIL_CADASTRADO);
        } else {
          console.log(e);
          throw new ForbiddenException(ErrorMessages.GERAL.ERRO_PADRAO);
        }
      }
    }
  }

  async signIn(dto: AuthDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        email: dto.usuario_email,
      },
    });
    if (!usuario) {
      throw new ForbiddenException(ErrorMessages.USUARIO.NAO_ENCONTRADO);
    }

    const senhaCorreta = await argon.verify(usuario.hash, dto.usuario_senha);

    if (!senhaCorreta) {
      throw new ForbiddenException(ErrorMessages.AUTH.CREDENCIAIS_INVALIDAS);
    }
    return this.signToken(usuario.usuario_id, usuario.email);

  }

  async signToken(usuarioId: number, usuarioEmail: string): Promise<{ access_token: string }> {
    const payload = {
      sub: usuarioId,
      usuarioEmail
    }
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.get('TOKEN_SECRET')
    })
    return {
      access_token: token
    }
  }
}
