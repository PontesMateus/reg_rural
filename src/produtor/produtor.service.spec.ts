import { Test, TestingModule } from '@nestjs/testing';
import { ProdutorService } from './produtor.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import * as cpfCnpjValidator from 'cpf-cnpj-validator';

describe('ProdutorService', () => {
    let service: ProdutorService;
    let prisma: PrismaService;

    const mockProdutor = {
        produtor_id: 1,
        produtor_nome: 'João Silva',
        produtor_cpf: '12345678901',
        produtor_cnpj: null,
        estado_id: 41,     
        cidade_id: 4106902, 
    };

    const prismaMock = {
        produtor: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockProdutor),
            findMany: jest.fn().mockResolvedValue([mockProdutor]),
            update: jest.fn().mockResolvedValue(mockProdutor),
            findUnique: jest.fn().mockResolvedValue(mockProdutor),
            delete: jest.fn().mockResolvedValue(mockProdutor),
        },
    };

    beforeEach(async () => {
        jest.spyOn(cpfCnpjValidator.cpf, 'isValid').mockReturnValue(true);
        jest.spyOn(cpfCnpjValidator.cnpj, 'isValid').mockReturnValue(true);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProdutorService,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();

        service = module.get<ProdutorService>(ProdutorService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('novoProdutor', () => {
        it('Insere Produtor', async () => {
            const dto = {
                produtor_nome: 'João Silva',
                produtor_cpf: '12345678909',
                produtor_cnpj: undefined,
                estado_id: 41,     
                cidade_id: 4106902, 
            };

            prisma.produtor.findFirst = jest.fn().mockResolvedValue(null);
            jest.spyOn(cpfCnpjValidator.cpf, 'isValid').mockReturnValue(true);

            const result = await service.novoProdutor(dto);

            expect(prisma.produtor.findFirst).toHaveBeenCalledWith({
                where: { produtor_cpf: dto.produtor_cpf },
            });
            expect(prisma.produtor.create).toHaveBeenCalledWith({ data: dto });
            expect(result).toEqual(mockProdutor);
        });

        it('Insere Produtor - Valida CPF único', async () => {
            prisma.produtor.findFirst = jest.fn().mockResolvedValue(mockProdutor);

            const dto = {
                produtor_nome: 'João Silva',
                produtor_cpf: '12345678909',
                estado_id: 41,     
                cidade_id: 4106902, 
            };
            await expect(service.novoProdutor(dto)).rejects.toThrow(ForbiddenException);
        });

        it('Insere Produtor - Valida cpf válido', async () => {
            prisma.produtor.findFirst = jest.fn().mockResolvedValue(null);
            jest.spyOn(cpfCnpjValidator.cpf, 'isValid').mockReturnValue(false);

            const dto = {
                produtor_nome: 'João Silva',
                produtor_cpf: 'invalid_cpf',
                produtor_cnpj: undefined,
                estado_id: 41,     
                cidade_id: 4106902, 
            };

            await expect(service.novoProdutor(dto)).rejects.toThrow(ForbiddenException);
        });

        it('Insere Produtor - Valida documento enviado', async () => {
            jest.spyOn(cpfCnpjValidator.cpf, 'isValid').mockReturnValue(false);
            jest.spyOn(cpfCnpjValidator.cnpj, 'isValid').mockReturnValue(false);

            const dto = {
                produtor_nome: 'João Silva',
                produtor_cpf: undefined,
                produtor_cnpj: undefined,
                estado_id: 41,     
                cidade_id: 4106902, 
            };
            await expect(service.novoProdutor(dto)).rejects.toThrow(ForbiddenException);
        });

        it('Insere Produtor - Valida Erro de criação', async () => {
            prisma.produtor.findFirst = jest.fn().mockResolvedValue(null);
            prisma.produtor.create = jest.fn().mockRejectedValue(new Error('fail'));

            const dto = {
                produtor_nome: 'João Silva',
                produtor_cpf: '12345678909',
                estado_id: 41,     
                cidade_id: 4106902, 
            };

            await expect(service.novoProdutor(dto)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('listProdutor', () => {
        it('Lista Produtores', async () => {
            const result = await service.listProdutor();
            expect(prisma.produtor.findMany).toHaveBeenCalledWith({
                orderBy: { produtor_nome: 'asc' },
            });
            expect(result).toEqual([mockProdutor]);
        });
    });

    describe('atualizaProdutor', () => {
        it('Atualiza Produtor', async () => {
            prisma.produtor.findFirst = jest.fn().mockResolvedValue(null);
            jest.spyOn(cpfCnpjValidator.cpf, 'isValid').mockReturnValue(true);

            const dto = { produtor_cpf: '12345678909' };
            const result = await service.atualizaProdutor(1, dto);

            expect(prisma.produtor.findFirst).toHaveBeenCalledWith({
                where: { produtor_cpf: dto.produtor_cpf, NOT: { produtor_id: 1 } },
            });
            expect(prisma.produtor.update).toHaveBeenCalledWith({
                where: { produtor_id: 1 },
                data: dto,
            });
            expect(result).toEqual(mockProdutor);
        });

        it('Atualiza Produtor - Valida se o cpf inserido já foi cadastrado no banco', async () => {
            prisma.produtor.findFirst = jest.fn().mockResolvedValue(mockProdutor);

            const dto = { produtor_cpf: '12345678909' };

            await expect(service.atualizaProdutor(1, dto)).rejects.toThrow(ForbiddenException);
        });

        it('Atualiza Produtor - Valida CPF', async () => {
            prisma.produtor.findFirst = jest.fn().mockResolvedValue(null);
            jest.spyOn(cpfCnpjValidator.cpf, 'isValid').mockReturnValue(false);

            const dto = { produtor_cpf: 'invalid_cpf' };

            await expect(service.atualizaProdutor(1, dto)).rejects.toThrow(ForbiddenException);
        });

        it('Atualiza Produtor - Insere registro de cnpj', async () => {
            prisma.produtor.findFirst = jest.fn().mockResolvedValue(null);
            jest.spyOn(cpfCnpjValidator.cnpj, 'isValid').mockReturnValue(true);

            const dto = { produtor_cnpj: '12345678000195' };
            const result = await service.atualizaProdutor(1, dto);

            expect(prisma.produtor.findFirst).toHaveBeenCalledWith({
                where: { produtor_cnpj: dto.produtor_cnpj, NOT: { produtor_id: 1 } },
            });
            expect(prisma.produtor.update).toHaveBeenCalledWith({
                where: { produtor_id: 1 },
                data: dto,
            });
            expect(result).toEqual(mockProdutor);
        });

        it('Atualiza Produtor - Valida CNPJ duplicado', async () => {
            prisma.produtor.findFirst = jest.fn().mockResolvedValue(mockProdutor);

            const dto = { produtor_cnpj: '12345678000195' };

            await expect(service.atualizaProdutor(1, dto)).rejects.toThrow(ForbiddenException);
        });

        it('Atualiza Produtor - Valida CNPJ válido', async () => {
            prisma.produtor.findFirst = jest.fn().mockResolvedValue(null);
            jest.spyOn(cpfCnpjValidator.cnpj, 'isValid').mockReturnValue(false);

            const dto = { produtor_cnpj: 'invalid_cnpj' };

            await expect(service.atualizaProdutor(1, dto)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('deleteProdutor', () => {
        it('Remove Produtor', async () => {
            const result = await service.deleteProdutor(1);
            expect(prisma.produtor.findUnique).toHaveBeenCalledWith({
                where: { produtor_id: 1 },
            });
            expect(prisma.produtor.delete).toHaveBeenCalledWith({
                where: { produtor_id: 1 },
            });
            expect(result).toEqual(mockProdutor);
        });

        it('Remove Produtor - Tratativa para id inválido', async () => {
            prisma.produtor.findUnique = jest.fn().mockResolvedValue(null);
            const result = await service.deleteProdutor(99);
            expect(result).toBeNull();
            expect(prisma.produtor.delete).not.toHaveBeenCalled();
        });
    });
});