import { Test, TestingModule } from '@nestjs/testing';
import { EstadoService } from './estado.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Estado } from '@prisma/client';

describe('EstadoService', () => {
  let service: EstadoService;
  let prisma: PrismaService;

  const mockEstados: Estado[] = [
    { estado_id: 41, estado_nome: 'São Paulo', estado_sigla: 'SP' }, 
    { estado_id: 31, estado_nome: 'Minas Gerais', estado_sigla: 'MG' },  
  ];

  const prismaMock = {
    estado: {
      findMany: jest.fn().mockResolvedValue(mockEstados),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstadoService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<EstadoService>(EstadoService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('Service Definido', () => {
    expect(service).toBeDefined();
  });

  it('Lista Estado', async () => {
    const result = await service.listEstado();
    expect(prisma.estado.findMany).toHaveBeenCalledWith({
      orderBy: { estado_nome: 'asc' },
    });
    expect(result).toEqual(mockEstados);
  });
});