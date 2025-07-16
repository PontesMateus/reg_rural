import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { HttpCode, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { inspect } from 'util';
import { ProdutorDto } from 'src/produtor/dto/produtor.dto';

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
    await prisma.limparDados();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    const dto: AuthDto = {
      usuario_email: "test@mail.com",
      usuario_senha: "2255"
    }

    it('Sign Up', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED)
    })

    it('Sign In', () => {
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

  describe('Estado', () => {
    it('Valida Estado', () => {
      return pactum.spec().get('/estado').withBearerToken('$S{usuarioToken}')
    });
  });
  describe('Cultura', () => {
    it('Valida Cultura', () => {
      return pactum.spec().get('/cultura').withBearerToken('$S{usuarioToken}')
    });
  });
  describe('Safra', () => {
    it('Valida Safra', () => {
      return pactum.spec().get('/safra').withBearerToken('$S{usuarioToken}')
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

    it('Insere Produtor', () => {
      return pactum.spec()
        .post('/produtor/novo')
        .withBearerToken('$S{usuarioToken}')
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED)
    });
  });

})