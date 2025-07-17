# Guia para Rodar o Projeto NestJS com Prisma

## Requisitos

- [Node.js](https://nodejs.org/) `>=18`
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (opcional, para o banco)
- [PostgreSQL](https://www.postgresql.org/) (caso use sem Docker)

---

## 1. Instalar as dependências

```bash
npm install
# ou
yarn install
``` 
## 2. Configurar variáveis de ambiente
```
cp .env.example .env
```
## 3. Subir o banco de dados com Docker (opcional)
```
npm run db:dev:restart
# ou
yarn db:dev:restart
```
## 4. Iniciar a aplicação
```
npm run start:dev
# ou
yarn start:dev
```
## 5. Rodar os testes
```
npm run test:e2e
# ou
yarn test:e2e
```

