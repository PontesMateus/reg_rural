import { Body, Controller, Delete, NotFoundException, Param, Post } from '@nestjs/common';
import { FazendaCulturaSafraService } from './fazenda-cultura-safra.service';
import { fazendaCulturaSafraDto } from './dto/fazenda-cultura-safra.dto';

@Controller('fazenda-cultura-safra')
export class FazendaCulturaSafraController {
    constructor(private fazendaCulturaSafraService: FazendaCulturaSafraService) { }

    @Post()
    async novaFazenda(@Body() dto: fazendaCulturaSafraDto) {
        return await this.fazendaCulturaSafraService.novoFazendaCulturaSafra(dto);
    }
        @Delete(':fazenda_id/:cultura_id/:safra_id')
        async delete(
            @Param('fazenda_id') fazendaId: string, 
            @Param('cultura_id') culturaId: string, 
            @Param('safra_id') safraId: string ) {
            const fazendaIdInt = parseInt(fazendaId, 10);
            const culturaIdInt = parseInt(culturaId, 10);
            const safraIdInt = parseInt(safraId, 10);

            const deleted = await this.fazendaCulturaSafraService.deleteFazendaCulturaSafra(fazendaIdInt, culturaIdInt, safraIdInt);
            if (!deleted) {
                throw new NotFoundException('Registro não encontrado');
            }
            return { message: 'Registro deletado com sucesso' };
        }
}
