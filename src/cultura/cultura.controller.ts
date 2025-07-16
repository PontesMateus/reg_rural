import { Controller, Get, UseGuards } from '@nestjs/common';
import { CulturaService } from './cultura.service';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('cultura')
export class CulturaController {
  constructor(private culturaService: CulturaService) {}
  
  @Get()
  async listCultura() {
    return this.culturaService.listCultura();
  }
}
