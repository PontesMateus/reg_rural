import { Test, TestingModule } from '@nestjs/testing';
import { CidadeService } from './cidade.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Cidade } from '@prisma/client';

describe('CidadeService', () => {
  let service: CidadeService;
  let prisma: PrismaService;

  const mockCidades: Cidade[] = [
    { cidade_id: 3550308, cidade_nome: 'São Paulo', estado_id: 35 }, 
    { cidade_id: 3509502, cidade_nome: 'Campinas', estado_id: 35 },  
  ];

  const prismaMock = {
    cidade: {
      findMany: jest.fn().mockResolvedValue(mockCidades),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CidadeService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CidadeService>(CidadeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('Service Definido', () => {
    expect(service).toBeDefined();
  });

  it('Lista Cidade', async () => {
    const result = await service.listCidade();
    expect(prisma.cidade.findMany).toHaveBeenCalledWith({
      orderBy: { cidade_nome: 'asc' },
    });
    expect(result).toEqual(mockCidades);
  });
});