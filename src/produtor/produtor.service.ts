import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ProdutorDto } from './dto/produtor.dto';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { Produtor } from '@prisma/client';
import { EditProdutorDto } from './dto';

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
                throw new ForbiddenException('CPF já cadastrado');
            }
            validaCpf = cpf.isValid(dto.produtor_cpf)
            if (!validaCpf) {
                throw new ForbiddenException('O CPF Informado é inválido.');
            }

        }
        if (dto.produtor_cnpj) {
            const cnpjExiste = await this.prisma.produtor.findFirst({
                where: {
                    produtor_cnpj: dto.produtor_cnpj ?? undefined,
                }
            });
            if (cnpjExiste) {
                throw new ForbiddenException('CNPJ já cadastrado');
            }
            validaCnpj = cnpj.isValid(dto.produtor_cnpj);
            if (!validaCnpj) {
                throw new ForbiddenException('O CNPJ Informado é inválido.');
            }
        }

        if (!validaCpf && !validaCnpj) {
            throw new ForbiddenException('Para cadastrar um produtor é necessário o mínimo de um documento válido (CPF e/ou CNPJ).');
        }
        try {
            const produtor = await this.prisma.produtor.create({
                data: dto,
            });
            return produtor;
        } catch (e) {
            console.log(e);
            throw new ForbiddenException(
                'Houve um problema com a requisição, tente novamente mais tarde.',
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
                throw new ForbiddenException('CPF já cadastrado');
            }
            if (!cpf.isValid(dto.produtor_cpf)) {
                throw new ForbiddenException('O CPF Informado é inválido.');
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
                throw new ForbiddenException('CNPJ já cadastrado');
            }
            if (!cnpj.isValid(dto.produtor_cnpj)) {
                throw new ForbiddenException('O CNPJ Informado é inválido.');
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
