import { Test, TestingModule } from '@nestjs/testing';
import { SafraService } from './safra.service';
import { PrismaService } from '../prisma/prisma.service';
import { Safra } from '@prisma/client';

describe('SafraService', () => {
  let service: SafraService;
  let prisma: PrismaService;

  const mockSafras: Safra[] = [
    {
      safra_id: 1,
      safra_ano: 2024,
    },
    {
      safra_id: 2,
      safra_ano: 2023,
    },
  ];

  const prismaMock = {
    safra: {
      findMany: jest.fn().mockResolvedValue(mockSafras),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SafraService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<SafraService>(SafraService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('Service Definido', () => {
    expect(service).toBeDefined();
  });

  describe('Lista Safra', () => {
    it('deve retornar a lista de safras ordenada por ano decrescente', async () => {
      const result = await service.listSafra();
      expect(prisma.safra.findMany).toHaveBeenCalledWith({
        orderBy: { safra_ano: 'desc' },
      });
      expect(result).toEqual(mockSafras);
    });
  });
});