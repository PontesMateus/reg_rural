import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { EstadoService } from './estado.service';

@UseGuards(JwtGuard)
@Controller('estado')
export class EstadoController {
    constructor(private estadoService: EstadoService) { }

    @Get()
    async listEstado() {
        return this.estadoService.listEstado();
    }
}
