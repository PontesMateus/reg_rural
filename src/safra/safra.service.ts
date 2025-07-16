import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Safra } from '@prisma/client';

@Injectable()
export class SafraService {
    constructor(private prisma: PrismaService) { }
    listSafra(): Promise<Safra[]> {
        return this.prisma.safra.findMany({
            orderBy: {safra_ano: 'desc'}
        });
    }
}
