import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { editFazendaDto, fazendaDto } from './dto';
import { Fazenda } from '@prisma/client';

@Injectable()
export class FazendaService {
    constructor(private prisma: PrismaService) { }

    async novaFazenda(dto: fazendaDto) {
        const somaArea = dto.fazenda_area_agr + dto.fazenda_area_veg;
        if (dto.fazenda_area_total < somaArea) {
            throw new BadRequestException(
                'A área total não pode ser menor que a soma das áreas agrícola e de vegetação.',
            );
        }
        try {
            const fazenda = await this.prisma.fazenda.create({
                data: dto,
            });
            return fazenda;
        } catch (e) {
            console.log(e);
            throw new ForbiddenException(
                'Houve um problema com a requisição, tente novamente mais tarde.',
            );
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
                    'Se for atualizar qualquer área, as três áreas (total, agrícola e vegetação) devem ser informadas.',
                );
            }

            const somaArea = dto.fazenda_area_agr + dto.fazenda_area_veg;

            if (dto.fazenda_area_total < somaArea) {
                throw new BadRequestException(
                    'A área total não pode ser menor que a soma das áreas agrícola e de vegetação.',
                );
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
}
