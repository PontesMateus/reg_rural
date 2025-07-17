import { Test, TestingModule } from '@nestjs/testing';
import { FazendaCulturaSafraService } from './fazenda-cultura-safra.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('FazendaCulturaSafraService', () => {
  let service: FazendaCulturaSafraService;
  let prisma: PrismaService;

  const mockRelation = {
    fazenda_id: 1,
    cultura_id: 2,
    safra_id: 3,
    safra: { safra_ano: 2023 },
    cultura: { cultura_id: 2, cultura_descricao: 'Milho' },
    fazenda: {
      estado: { estado_id: 41, estado_nome: 'Paraná' },
    },
  };

  const prismaMock = {
    fazendaCulturaSafra: {
      create: jest.fn().mockResolvedValue(mockRelation),
      findUnique: jest.fn().mockResolvedValue(mockRelation),
      delete: jest.fn().mockResolvedValue(mockRelation),
      findMany: jest.fn().mockResolvedValue([mockRelation]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FazendaCulturaSafraService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<FazendaCulturaSafraService>(FazendaCulturaSafraService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('novoFazendaCulturaSafra', () => {
    it('Insere Vinculo', async () => {
      const dto = {
        fazenda_id: 1,
        cultura_id: 2,
        safra_id: 3,
      };
      const result = await service.novoFazendaCulturaSafra(dto);
      expect(prisma.fazendaCulturaSafra.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockRelation);
    });

    it('Insere Vinculo - Valida erro', async () => {
      prisma.fazendaCulturaSafra.create = jest.fn().mockRejectedValue(new Error('fail'));
      await expect(service.novoFazendaCulturaSafra({} as any)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteFazendaCulturaSafra', () => {
    it('Remove vinculo', async () => {
      const result = await service.deleteFazendaCulturaSafra(1, 2, 3);
      expect(prisma.fazendaCulturaSafra.findUnique).toHaveBeenCalledWith({
        where: {
          fazenda_id_cultura_id_safra_id: { fazenda_id: 1, cultura_id: 2, safra_id: 3 },
        },
      });
      expect(prisma.fazendaCulturaSafra.delete).toHaveBeenCalledWith({
        where: {
          fazenda_id_cultura_id_safra_id: { fazenda_id: 1, cultura_id: 2, safra_id: 3 },
        },
      });
      expect(result).toEqual(mockRelation);
    });
  });

  describe('getCulturasPorSafra', () => {
    it('Lista de culturas agrupadas por safra', async () => {
      const mockData = [
        mockRelation,
        {
          ...mockRelation,
          cultura_id: 4,
          cultura: { cultura_id: 4, cultura_descricao: 'Soja' },
          safra_id: 3,
          safra: { safra_ano: 2023 },
        },
        {
          ...mockRelation,
          safra_id: 2,
          safra: { safra_ano: 2022 },
          cultura_id: 5,
          cultura: { cultura_id: 5, cultura_descricao: 'Trigo' },
        },
      ];
      prisma.fazendaCulturaSafra.findMany = jest.fn().mockResolvedValue(mockData);

      const result = await service.getCulturasPorSafra();

      expect(result).toEqual([
        {
          safra_id: 3,
          safra_ano: 2023,
          culturas: [
            { cultura_id: 2, cultura_descricao: 'Milho' },
            { cultura_id: 4, cultura_descricao: 'Soja' },
          ],
        },
        {
          safra_id: 2,
          safra_ano: 2022,
          culturas: [{ cultura_id: 5, cultura_descricao: 'Trigo' }],
        },
      ]);
    });
  });

  describe('getCulturasPorEstado', () => {
    it('Lista de culturas agrupadas por estado', async () => {
      const mockData = [
        mockRelation,
        {
          ...mockRelation,
          cultura: { cultura_id: 4, cultura_descricao: 'Soja' },
          fazenda: {
            estado: { estado_id: 42, estado_nome: 'São Paulo' },
          },
        },
        {
          ...mockRelation,
          cultura: { cultura_id: 5, cultura_descricao: 'Trigo' },
          fazenda: {
            estado: { estado_id: 41, estado_nome: 'Paraná' },
          },
        },
      ];
      prisma.fazendaCulturaSafra.findMany = jest.fn().mockResolvedValue(mockData);

      const result = await service.getCulturasPorEstado();

      expect(result).toEqual([
        {
          estado_id: 41,
          estado_nome: 'Paraná',
          culturas: [
            { cultura_id: 2, cultura_descricao: 'Milho' },
            { cultura_id: 5, cultura_descricao: 'Trigo' },
          ],
        },
        {
          estado_id: 42,
          estado_nome: 'São Paulo',
          culturas: [{ cultura_id: 4, cultura_descricao: 'Soja' }],
        },
      ]);
    });
  });
});