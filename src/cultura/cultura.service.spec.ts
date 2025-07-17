import { Test, TestingModule } from '@nestjs/testing';
import { CulturaService } from './cultura.service';
import { PrismaService } from '../prisma/prisma.service';
import { Cultura } from '@prisma/client';

describe('CulturaService', () => {
  let service: CulturaService;
  let prisma: PrismaService;

  const mockCultura: Cultura[] = [
    { cultura_id: 1, cultura_descricao: 'Soja' },
    { cultura_id: 2, cultura_descricao: 'Milho' },
  ];

  const prismaMock = {
    cultura: {
      findMany: jest.fn().mockResolvedValue(mockCultura),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CulturaService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CulturaService>(CulturaService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('Service Definido', () => {
    expect(service).toBeDefined();
  });

  it('Lista Cultura', async () => {
    const result = await service.listCultura();
    expect(prisma.cultura.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockCultura);
  });
});