import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ProdutorService } from './produtor.service';
import { ProdutorDto } from './dto/produtor.dto';
import { EditProdutorDto } from './dto';

@Controller('produtor')
export class ProdutorController {
    constructor(private produtorService: ProdutorService) { }
    @Post()
    async novoProdutor(@Body() dto: ProdutorDto) {
        return await this.produtorService.novoProdutor(dto);
    }

    @Get()
    async listProdutor() {
        return await this.produtorService.listProdutor();
    }

    @Patch(':produtor_id')
    async atualizaProdutor(@Param('produtor_id') produtorId: string, @Body() dto: EditProdutorDto) {
        const id = parseInt(produtorId, 10);
        const data = await this.produtorService.atualizaProdutor(id, dto);
        return data;
    }

    @Delete(':produtor_id')
    async delete(@Param('produtor_id') produtorId: string) {
        const id = parseInt(produtorId, 10);
        const deleted = await this.produtorService.deleteProdutor(id);
        if (!deleted) {
            throw new NotFoundException('Registro não encontrado');
        }
        return { message: 'Registro deletado com sucesso' };
    }

}
