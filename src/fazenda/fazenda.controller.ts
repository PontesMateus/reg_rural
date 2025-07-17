import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { editFazendaDto, fazendaDto } from './dto';
import { FazendaService } from './fazenda.service';
import { JwtGuard } from '../../src/auth/guard';

@UseGuards(JwtGuard)
@Controller('fazenda')
export class FazendaController {
    constructor(private fazendaService: FazendaService) { }

    @Post()
    async novaFazenda(@Body() dto: fazendaDto) {
        return await this.fazendaService.novaFazenda(dto);
    }

    @Get()
    async listFazenda() {
        return await this.fazendaService.listFazenda();
    }

    @Get('produtor/:fazenda_id')
    async listFazendaPorProdutor(@Param('produtor_id') produtorId: string) {
        const id = parseInt(produtorId, 10);
        return await this.fazendaService.listFazendaPorProdutor(id);
    }
    @Get('resumo')
    async getResumoFazendas() {
        return this.fazendaService.getResumoFazendas();
    }

    @Patch(':fazenda_id')
    async atualizaProdutor(@Param('fazenda_id') fazendaId: string, @Body() dto: editFazendaDto) {
        const id = parseInt(fazendaId, 10);
        const data = await this.fazendaService.atualizaFazenda(id, dto);
        return data;
    }

    @Delete(':fazenda_id')
    async delete(@Param('fazenda_id') fazendaId: string) {
        const id = parseInt(fazendaId, 10);
        const deleted = await this.fazendaService.deleteFazenda(id);
        if (!deleted) {
            throw new NotFoundException('Registro não encontrado');
        }
        return { message: 'Registro deletado com sucesso' };
    }
}
