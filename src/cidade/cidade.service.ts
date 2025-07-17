import { Injectable } from '@nestjs/common';
import { Cidade } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';

@Injectable()
export class CidadeService {
    constructor(private prisma: PrismaService) { }
    listCidade(): Promise<Cidade[]> {
        return this.prisma.cidade.findMany({
            orderBy: {
                cidade_nome: 'asc',
            }
        });
    }
}
