import { Body, Controller, Post } from '@nestjs/common';
import { ProdutorService } from './produtor.service';
import { ProdutorDto } from './dto/produtor.dto';

@Controller('produtor')
export class ProdutorController {
    constructor(private produtorService: ProdutorService) { }
    @Post('novo')
    async novoProdutor(@Body() dto: ProdutorDto) {
        return await this.produtorService.novoProdutor(dto);
    }
}
