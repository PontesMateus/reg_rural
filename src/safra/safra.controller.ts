import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { SafraService } from './safra.service';

@UseGuards(JwtGuard)
@Controller('safra')
export class SafraController {
    constructor(private safraService: SafraService) { }

    @Get()
    async listCultura() {
        return this.safraService.listSafra();
    }
}
