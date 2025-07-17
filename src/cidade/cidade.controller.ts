import { Controller, Get, UseGuards } from '@nestjs/common';
import { CidadeService } from './cidade.service';
import { JwtGuard } from '../../src/auth/guard';

@UseGuards(JwtGuard)
@Controller('cidade')
export class CidadeController {
    constructor(private cidadeService: CidadeService) { }

    @Get()
    async listCidade() {
        return this.cidadeService.listCidade();
    }
}
