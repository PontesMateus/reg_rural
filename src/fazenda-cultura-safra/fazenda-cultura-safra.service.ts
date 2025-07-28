import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { fazendaCulturaSafraDto } from './dto/fazenda-cultura-safra.dto';
import { ErrorMessages } from '../../common/constants/error-messages.constant';

@Injectable()
export class FazendaCulturaSafraService {
    constructor(private prisma: PrismaService) { }

    async novoFazendaCulturaSafra(dto: fazendaCulturaSafraDto) {
        try {
            const response = await this.prisma.fazendaCulturaSafra.create({
                data: dto,
            });
            return response;
        } catch (e) {
            console.log(e);
            throw new ForbiddenException(ErrorMessages.GERAL.ERRO_PADRAO);
        }
    }

    async deleteFazendaCulturaSafra(fazendaId: number, culturaId: number, safraId: number) {
        const result = await this.prisma.fazendaCulturaSafra.findUnique({
            where: {
                fazenda_id_cultura_id_safra_id: {
                    fazenda_id: fazendaId,
                    cultura_id: culturaId,
                    safra_id: safraId,
                },
            },
        });
        if (!result) {
            return null;
        }
        await this.prisma.fazendaCulturaSafra.delete({
            where: {
                fazenda_id_cultura_id_safra_id: {
                    fazenda_id: fazendaId,
                    cultura_id: culturaId,
                    safra_id: safraId,
                },
            },
        });
        return result;
    }

    async getCulturasPorSafra() {
        const relacoes = await this.prisma.fazendaCulturaSafra.findMany({
            include: {
                safra: true,
                cultura: true,
            },
        });

        const agrupado = relacoes.reduce((acc, item) => {
            const safraId = item.safra_id;

            if (!acc[safraId]) {
                acc[safraId] = {
                    safra_id: item.safra_id,
                    safra_ano: item.safra.safra_ano,
                    culturas: [],
                };
            }

            const jaExiste = acc[safraId].culturas.some(
                (c) => c.cultura_id === item.cultura_id
            );

            if (!jaExiste) {
                acc[safraId].culturas.push({
                    cultura_id: item.cultura_id,
                    cultura_descricao: item.cultura.cultura_descricao,
                });
            }

            return acc;
        }, {} as Record<number, any>);

        return Object.values(agrupado).sort((a, b) => b.safra_ano - a.safra_ano);
    }

    async getCulturasPorEstado() {
        const relacoes = await this.prisma.fazendaCulturaSafra.findMany({
            include: {
                cultura: true,
                fazenda: {
                    include: {
                        estado: true,
                    },
                },
            },
        });

        const agrupado = relacoes.reduce((acc, item) => {
            const estadoId = item.fazenda.estado.estado_id;

            if (!acc[estadoId]) {
                acc[estadoId] = {
                    estado_id: estadoId,
                    estado_nome: item.fazenda.estado.estado_nome,
                    culturas: [],
                };
            }

            const jaExiste = acc[estadoId].culturas.some(
                (c) => c.cultura_id === item.cultura.cultura_id,
            );

            if (!jaExiste) {
                acc[estadoId].culturas.push({
                    cultura_id: item.cultura.cultura_id,
                    cultura_descricao: item.cultura.cultura_descricao,
                });
            }

            return acc;
        }, {} as Record<number, any>);

        return Object.values(agrupado).sort((a, b) =>
            a.estado_nome.localeCompare(b.estado_nome),
        );
    }

}
