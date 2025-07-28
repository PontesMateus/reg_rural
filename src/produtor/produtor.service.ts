import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ProdutorDto } from './dto/produtor.dto';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { Produtor } from '@prisma/client';
import { EditProdutorDto } from './dto';
import { ErrorMessages } from '../../common/constants/error-messages.constant';

@Injectable()
export class ProdutorService {
    constructor(private prisma: PrismaService) { }

    async novoProdutor(dto: ProdutorDto) {
        let validaCpf = false;
        let validaCnpj = false;
        if (dto.produtor_cpf) {
            const cpfExiste = await this.prisma.produtor.findFirst({
                where: {
                    produtor_cpf: dto.produtor_cpf ?? undefined,
                }
            });
            if (cpfExiste) {
                throw new ForbiddenException(ErrorMessages.PRODUTOR.CPF_CADASTRADO);
            }
            validaCpf = cpf.isValid(dto.produtor_cpf)
            if (!validaCpf) {
                throw new ForbiddenException(ErrorMessages.PRODUTOR.CPF_INVALIDO);
            }

        }
        if (dto.produtor_cnpj) {
            const cnpjExiste = await this.prisma.produtor.findFirst({
                where: {
                    produtor_cnpj: dto.produtor_cnpj ?? undefined,
                }
            });
            if (cnpjExiste) {
                throw new ForbiddenException(ErrorMessages.PRODUTOR.CNPJ_CADASTRADO);
            }
            validaCnpj = cnpj.isValid(dto.produtor_cnpj);
            if (!validaCnpj) {
                throw new ForbiddenException(ErrorMessages.PRODUTOR.CNPJ_INVALIDO);
            }
        }

        if (!validaCpf && !validaCnpj) {
            throw new ForbiddenException(ErrorMessages.PRODUTOR.DOCUMENTO_REQUERIDO);
        }
        try {
            const produtor = await this.prisma.produtor.create({
                data: dto,
            });
            return produtor;
        } catch (e) {
            console.log(e);
            throw new ForbiddenException(
                ErrorMessages.GERAL.ERRO_PADRAO
            );
        }
    }

    listProdutor(): Promise<Produtor[]> {
        return this.prisma.produtor.findMany({
            orderBy: {
                produtor_nome: 'asc',
            }
        });
    }

    async atualizaProdutor(produtorId: number, dto: EditProdutorDto) {
        if (dto.produtor_cpf) {
            const cpfExiste = await this.prisma.produtor.findFirst({
                where: {
                    produtor_cpf: dto.produtor_cpf ?? undefined,
                    NOT: {
                        produtor_id: produtorId,
                    }
                }
            });
            if (cpfExiste) {
                throw new ForbiddenException(ErrorMessages.PRODUTOR.CPF_CADASTRADO);
            }
            if (!cpf.isValid(dto.produtor_cpf)) {
                throw new ForbiddenException(ErrorMessages.PRODUTOR.CPF_INVALIDO);
            }

        }
        if (dto.produtor_cnpj) {
            const cnpjExiste = await this.prisma.produtor.findFirst({
                where: {
                    produtor_cnpj: dto.produtor_cnpj ?? undefined,
                    NOT: {
                        produtor_id: produtorId,
                    }
                }
            });
            if (cnpjExiste) {
                throw new ForbiddenException(ErrorMessages.PRODUTOR.CNPJ_CADASTRADO);
            }
            if (!cnpj.isValid(dto.produtor_cnpj)) {
                throw new ForbiddenException(ErrorMessages.PRODUTOR.CNPJ_INVALIDO);
            }
        }

        const produtor = await this.prisma.produtor.update({
            where: {
                produtor_id: produtorId
            },
            data: {
                ...dto
            }
        })
        return produtor;
    }

    async deleteProdutor(produtorId: number) {
        const produtor = await this.prisma.produtor.findUnique({
            where: { produtor_id: produtorId },
        });
        if (!produtor) {
            return null;
        }
        await this.prisma.produtor.delete({
            where: { produtor_id: produtorId },
        });
        return produtor;
    }
}
