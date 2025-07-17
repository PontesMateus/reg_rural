import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { fazendaCulturaSafraDto } from './dto/fazenda-cultura-safra.dto';

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
            throw new ForbiddenException(
                'Houve um problema com a requisição, tente novamente mais tarde.',
            );
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
}
