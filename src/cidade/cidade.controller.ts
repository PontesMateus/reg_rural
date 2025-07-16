import { Controller, Get, UseGuards } from '@nestjs/common';
import { CidadeService } from './cidade.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from 'src/auth/decorator';
import { Usuario } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('cidade')
export class CidadeController {
  constructor(private cidadeService: CidadeService) {}
  
  @Get()
  async listCidade(@GetUser() usuario: Usuario) {
    return usuario;
  }
}
