import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cultura } from '@prisma/client';

@Injectable()
export class CulturaService {
    constructor(private prisma: PrismaService) {}
    listCultura(): Promise<Cultura[]>{
        return this.prisma.cultura.findMany();
    }

}
