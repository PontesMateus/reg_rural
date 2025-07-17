import { Test, TestingModule } from '@nestjs/testing';
import { FazendaService } from './fazenda.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('FazendaService', () => {
    let service: FazendaService;
    let prisma: PrismaService;

    const mockFazenda = {
        fazenda_id: 1,
        fazenda_descricao: 'Fazenda Teste',
        fazenda_area_total: 100,
        fazenda_area_agr: 60,
        fazenda_area_veg: 40,
        produtor_id: 1,
        estado_id: 41,
        cidade_id: 4106902,
    };

    const prismaMock = {
        fazenda: {
            create: jest.fn().mockResolvedValue(mockFazenda),
            findMany: jest.fn().mockResolvedValue([mockFazenda]),
            update: jest.fn().mockResolvedValue(mockFazenda),
            findUnique: jest.fn().mockResolvedValue(mockFazenda),
            delete: jest.fn().mockResolvedValue(mockFazenda),
            count: jest.fn().mockResolvedValue(1),
            aggregate: jest.fn().mockResolvedValue({
                _sum: {
                    fazenda_area_total: 100,
                    fazenda_area_agr: 60,
                    fazenda_area_veg: 40,
                },
            }),
            groupBy: jest.fn().mockResolvedValue([
                {
                    estado_id: 41,
                    _count: { fazenda_id: 2 },
                    _sum: {
                        fazenda_area_total: 200,
                        fazenda_area_agr: 120,
                        fazenda_area_veg: 80,
                    },
                },
            ]),
        },
        estado: {
            findMany: jest.fn().mockResolvedValue([
                { estado_id: 41, estado_nome: 'Paraná' },
            ]),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FazendaService,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();

        service = module.get<FazendaService>(FazendaService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('Service Definido', () => {
        expect(service).toBeDefined();
    });

    describe('novaFazenda', () => {
        it('Insere Fazenda', async () => {
            const dto = {
                ...mockFazenda,
            };
            const result = await service.novaFazenda(dto);
            expect(result).toEqual(mockFazenda);
            expect(prisma.fazenda.create).toHaveBeenCalled();
        });

        it('Insere Fazenda - Valida tratativa área', async () => {
            const dto = {
                ...mockFazenda,
                fazenda_area_total: 90, // menor que 60 + 40
            };
            await expect(service.novaFazenda(dto)).rejects.toThrow(BadRequestException);
        });

        it('Insere Fazenda - Valida reject', async () => {
            prisma.fazenda.create = jest.fn().mockRejectedValue(new Error('erro'));
            const dto = {
                ...mockFazenda,
            };
            await expect(service.novaFazenda(dto)).rejects.toThrow(ForbiddenException);
        });
    });

    it('Lista Fazenda', async () => {
        const result = await service.listFazenda();
        expect(result).toEqual([mockFazenda]);
    });

    it('Lista fazenda por produtor', async () => {
        const result = await service.listFazendaPorProdutor(1);
        expect(prisma.fazenda.findMany).toHaveBeenCalledWith({
            where: { produtor_id: 1 },
            orderBy: { fazenda_descricao: 'asc' },
        });
        expect(result).toEqual([mockFazenda]);
    });

    describe('atualizaFazenda', () => {
        it('Edita fazenda', async () => {
            const dto = {
                fazenda_area_total: 100,
                fazenda_area_agr: 60,
                fazenda_area_veg: 40,
            };
            const result = await service.atualizaFazenda(1, dto);
            expect(result).toEqual(mockFazenda);
        });

        it('Edita fazenda - Valida tratativa área', async () => {
            const dto = {
                fazenda_area_total: 100,
                fazenda_area_agr: 60,
            };
            await expect(service.atualizaFazenda(1, dto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('deleteFazenda', () => {
        it('Deleta registro de fazenda', async () => {
            const result = await service.deleteFazenda(1);
            expect(result).toEqual(mockFazenda);
        });

        it('Deleta registro de fazenda - Valida se id informado existe', async () => {
            prisma.fazenda.findUnique = jest.fn().mockResolvedValue(null);
            const result = await service.deleteFazenda(99);
            expect(result).toBeNull();
        });
    });

    it('Resumo Fazenda', async () => {
        const result = await service.getResumoFazendas();
        expect(result).toEqual({
            total_fazendas: 1,
            soma_area_total: 100,
            soma_area_agr: 60,
            soma_area_veg: 40,
        });
    });

    it('Relatório de fazendas por estado', async () => {
        const result = await service.getFazendasPorEstado();
        expect(result).toEqual([
            {
                estado_id: 41,
                estado_nome: 'Paraná',
                total_fazendas: 2,
                soma_area_total: 200,
                soma_area_agr: 120,
                soma_area_veg: 80,
            },
        ]);
    });
});