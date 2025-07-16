import { Injectable } from '@nestjs/common';
import { Estado } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EstadoService {
    constructor(private prisma: PrismaService) { }
    listEstado(): Promise<Estado[]> {
        return this.prisma.estado.findMany({
            orderBy: {
                estado_nome: 'asc',
            }
        });
    }
}
