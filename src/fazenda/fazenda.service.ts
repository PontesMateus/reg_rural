import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { editFazendaDto, fazendaDto } from './dto';
import { Fazenda } from '@prisma/client';
import { ErrorMessages } from '../../common/constants/error-messages.constant';

@Injectable()
export class FazendaService {
    constructor(private prisma: PrismaService) { }

    async novaFazenda(dto: fazendaDto) {
        const somaArea = dto.fazenda_area_agr + dto.fazenda_area_veg;
        if (dto.fazenda_area_total < somaArea) {
            throw new BadRequestException(ErrorMessages.FAZENDA.VALIDA_AREA);
        }
        try {
            const fazenda = await this.prisma.fazenda.create({
                data: dto,
            });
            return fazenda;
        } catch (e) {
            console.log(e);
            throw new ForbiddenException(ErrorMessages.GERAL.ERRO_PADRAO);
        }
    }

    listFazenda(): Promise<Fazenda[]> {
        return this.prisma.fazenda.findMany({
            orderBy: {
                fazenda_descricao: 'asc',
            }
        });
    }

    listFazendaPorProdutor(produtorId: number): Promise<Fazenda[]> {
        return this.prisma.fazenda.findMany({
            where: {
                produtor_id: produtorId
            },
            orderBy: {
                fazenda_descricao: 'asc',
            }
        });
    }

    async atualizaFazenda(fazendaId: number, dto: editFazendaDto) {
        if (
            dto.fazenda_area_total !== undefined ||
            dto.fazenda_area_agr !== undefined ||
            dto.fazenda_area_veg !== undefined
        ) {
            if (
                dto.fazenda_area_total === undefined ||
                dto.fazenda_area_agr === undefined ||
                dto.fazenda_area_veg === undefined
            ) {
                throw new BadRequestException(
                    ErrorMessages.FAZENDA.VALIDA_ATUALIZA_AREA,
                );
            }

            const somaArea = dto.fazenda_area_agr + dto.fazenda_area_veg;

            if (dto.fazenda_area_total < somaArea) {
                throw new BadRequestException(ErrorMessages.FAZENDA.VALIDA_AREA);
            }
        }

        const fazenda = await this.prisma.fazenda.update({
            where: {
                fazenda_id: fazendaId
            },
            data: {
                ...dto
            }
        })
        return fazenda;
    }

    async deleteFazenda(fazendaId: number) {
        const fazenda = await this.prisma.fazenda.findUnique({
            where: { fazenda_id: fazendaId },
        });
        if (!fazenda) {
            return null;
        }
        await this.prisma.fazenda.delete({
            where: { fazenda_id: fazendaId },
        });
        return fazenda;
    }

    async getResumoFazendas() {
        const totalFazendas = await this.prisma.fazenda.count();

        const somaAreaTotalObj = await this.prisma.fazenda.aggregate({
            _sum: {
                fazenda_area_total: true,
                fazenda_area_agr: true,
                fazenda_area_veg: true,
            },
        });

        return {
            total_fazendas: totalFazendas,
            soma_area_total: Number(somaAreaTotalObj._sum.fazenda_area_total ?? 0),
            soma_area_agr: Number(somaAreaTotalObj._sum.fazenda_area_agr ?? 0),
            soma_area_veg: Number(somaAreaTotalObj._sum.fazenda_area_veg ?? 0),
        };
    }

    async getFazendasPorEstado() {
        const resultados = await this.prisma.fazenda.groupBy({
            by: ['estado_id'],
            _count: {
                fazenda_id: true,
            },
            _sum: {
                fazenda_area_total: true,
                fazenda_area_agr: true,
                fazenda_area_veg: true,
            },
        });

        const estados = await this.prisma.estado.findMany({
            where: {
                estado_id: {
                    in: resultados.map((r) => r.estado_id),
                },
            },
        });

        return resultados.map((r) => {
            const estado = estados.find((e) => e.estado_id === r.estado_id);
            return {
                estado_id: r.estado_id,
                estado_nome: estado?.estado_nome || 'N/A',
                total_fazendas: r._count.fazenda_id,
                soma_area_total: r._sum.fazenda_area_total ?? 0,
                soma_area_agr: r._sum.fazenda_area_agr ?? 0,
                soma_area_veg: r._sum.fazenda_area_veg ?? 0,
            };
        });
    }
}
