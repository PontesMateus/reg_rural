import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { ProdutorDto } from '../src/produtor/dto/produtor.dto';
import { editFazendaDto, fazendaDto } from '../src/fazenda/dto';
import { fazendaCulturaSafraDto } from 'src/fazenda-cultura-safra/dto/fazenda-cultura-safra.dto';
import { EditProdutorDto } from 'src/produtor/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await prisma.limparDados();
    app.close();
  });
  describe('Auth', () => {
    const dto: AuthDto = {
      usuario_email: "test@mail.com",
      usuario_senha: "2255"
    }

    it('Cadastro', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED)
    })

    it('Login', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto)
        .expectStatus(HttpStatus.OK)
        .stores('usuarioToken', 'access_token')
    })
    it('Validar Credenciais', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .expectStatus(HttpStatus.BAD_REQUEST)
    })
  });

  describe('Cidade', () => {
    it('Lista Cidade', () => {
      return pactum.spec()
        .get('/cidade')
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK)
    });
  });

  describe('Cultura', () => {
    it('Lista Cultura', () => {
      return pactum.spec()
        .get('/cultura')
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK)
    });
  });

  describe('Estado', () => {
    it('Lista Estado', () => {
      return pactum.spec().get('/estado').withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK)
    });
  });

  describe('Fazenda', () => {
    const dto: fazendaDto = {
      produtor_id: 1,
      fazenda_descricao: "Fazenda de teste",
      fazenda_area_total: 550,
      fazenda_area_agr: 300,
      fazenda_area_veg: 180,
      estado_id: 31,
      cidade_id: 3137007
    }

    const dtoPatch: editFazendaDto = {
      produtor_id: 1,
      fazenda_descricao: "Fazenda de teste",
      fazenda_area_total: 550,
      fazenda_area_agr: 400,
      fazenda_area_veg: 120,
    }

    const dtoValidaArea: fazendaDto = {
      produtor_id: 1,
      fazenda_descricao: "Fazenda de teste",
      fazenda_area_total: 200,
      fazenda_area_agr: 300,
      fazenda_area_veg: 180,
      estado_id: 31,
      cidade_id: 3137007
    }

    it('Insere Fazenda', () => {
      return pactum.spec()
        .post('/fazenda')
        .withBearerToken('$S{usuarioToken}')
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED)
        .stores('fazendaId', 'fazenda_id');
    });

    it('Insere Fazenda - Valida tratativa área', () => {
      return pactum.spec()
        .post('/fazenda')
        .withBearerToken('$S{usuarioToken}')
        .withBody(dtoValidaArea)
        .expectStatus(HttpStatus.BAD_REQUEST)
    });

    it('Lista Fazenda', () => {
      return pactum.spec()
        .get('/fazenda')
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK)
    });

    it('Lista Fazenda Por Produtor', () => {
      return pactum
        .spec()
        .get('/fazenda/produtor/{produtor_id}')
        .withPathParams('produtor_id', '1')
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK);
    });

    it('Resumo fazendas', () => {
      return pactum.spec().get('/fazenda/resumo').withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK)
    });

    it('Relatório de fazendas por estado', () => {
      return pactum.spec()
        .get('/fazenda/por-estado')
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK)
    });

    it('Edita fazenda', () => {
      return pactum.spec()
        .patch('/fazenda/{fazenda_id}')
        .withPathParams('fazenda_id', '$S{fazendaId}')
        .withBearerToken('$S{usuarioToken}')
        .withBody(dtoPatch)
        .expectStatus(HttpStatus.OK)
    });

    it('Deleta registro de fazenda', () => {
      return pactum
        .spec()
        .delete('/fazenda/{fazenda_id}')
        .withPathParams('fazenda_id', '$S{fazendaId}')
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK);
    });
  });

  describe('FazendaCulturaSafra', () => {
    const dto: fazendaCulturaSafraDto = {
      fazenda_id: 4,
      cultura_id: 4,
      safra_id: 4
    }

    it('Insere Vinculo fazenda_cultura_safra', () => {
      return pactum.spec()
        .post('/fazenda-cultura-safra')
        .withBearerToken('$S{usuarioToken}')
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED)
    });

    it('Deleta Vinculo fazenda_cultura_safra', () => {
      return pactum
        .spec()
        .delete('/fazenda-cultura-safra/{fazenda_id}/{cultura_id}/{safra_id}')
        .withPathParams({
          fazenda_id: dto.fazenda_id,
          cultura_id: dto.cultura_id,
          safra_id: dto.safra_id,
        })
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK);
    });

    it('Relatório de Culturas por Safra', () => {
      return pactum.spec()
        .get('/fazenda-cultura-safra/culturas-por-safra')
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK)
    });

    it('Relatório de fazendas por estado', () => {
      return pactum.spec()
        .get('/fazenda-cultura-safra/culturas-por-estado')
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK)
    });
  });

  describe('Safra', () => {
    it('Lista Safra', () => {
      return pactum.spec()
        .get('/safra')
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK)
    });
  });

  describe('Produtor', () => {
    const dto: ProdutorDto = {
      produtor_nome: "Teste",
      produtor_cpf: "57422626046",
      produtor_cnpj: "51918501000192",
      estado_id: 31,
      cidade_id: 3137007
    }
    const dtoDocInvalido: ProdutorDto = {
      produtor_nome: "Teste",
      produtor_cpf: "00000000000",
      produtor_cnpj: "51918501000192",
      estado_id: 31,
      cidade_id: 3137007
    }
    const dtoPatch: EditProdutorDto = {
      produtor_nome: "Teste Edit",
      estado_id: 31,
      cidade_id: 3137007
    }
    const dtoPatchDocInvalido: EditProdutorDto = {
      produtor_nome: "Teste Edit",
      produtor_cnpj: "11111111111111",
      estado_id: 31,
      cidade_id: 3137007
    }

    it('Insere Produtor', () => {
      return pactum.spec()
        .post('/produtor')
        .withBearerToken('$S{usuarioToken}')
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED)
        .stores('produtorId', 'produtor_id');
    });

    it('Insere Produtor Valida CPF', () => {
      return pactum.spec()
        .post('/produtor')
        .withBearerToken('$S{usuarioToken}')
        .withBody(dtoDocInvalido)
        .expectStatus(HttpStatus.FORBIDDEN)
    });

    it('Edita Produtor', () => {
      return pactum.spec()
        .patch('/produtor/{produtor_id}')
        .withPathParams('produtor_id', '$S{produtorId}')
        .withBearerToken('$S{usuarioToken}')
        .withBody(dtoPatch)
        .expectStatus(HttpStatus.OK)
    });

    it('Edita Produtor Valida CNPJ', () => {
      return pactum.spec()
        .patch('/produtor/{produtor_id}')
        .withPathParams('produtor_id', '$S{produtorId}')
        .withBearerToken('$S{usuarioToken}')
        .withBody(dtoPatchDocInvalido)
        .expectStatus(HttpStatus.FORBIDDEN)
    });

    it('Lista Produtor', () => {
      return pactum.spec()
        .get('/produtor')
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK)
    });
    
    it('Deleta registro de produtor', () => {
      return pactum
        .spec()
        .delete('/produtor/{produtor_id}')
        .withPathParams('produtor_id', '$S{produtorId}')
        .withBearerToken('$S{usuarioToken}')
        .expectStatus(HttpStatus.OK);
    });

  });

})