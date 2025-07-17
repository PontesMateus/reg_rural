# Guia para Rodar o Projeto NestJS com Prisma

## Requisitos

- [Node.js](https://nodejs.org/) `>=18`
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (opcional, para o banco)
- [PostgreSQL](https://www.postgresql.org/) (caso use sem Docker)
- [Insomnia](https://insomnia.rest/) (recomendado para testar as rotas da API)

---

## 1. Instalar as dependências

```bash
npm install
# ou
yarn install
``` 
## 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```
## 3. Gerar o banco de dados via prisma
```bash
npx prisma generate
```
## 4. Subir o banco de dados com Docker e popular banco de dados (opcional)
```bash
npm run db:dev:restart
# ou
yarn db:dev:restart
```
## 5. Iniciar a aplicação
```bash
npm run start:dev
# ou
yarn start:dev
```
## 6. Rodar os testes
```bash
npm run test:e2e
# ou
yarn test:e2e
```
## 7. Importar Collection no Insomnia
1. Abra o **Insomnia**.
2. No menu superior, clique em **`File` > `Import` > `From File`**.
3. Selecione o arquivo `reg-rural-insomnia.json` presente na raiz do projeto.
4. A collection será importada com todas as rotas configuradas.

---

## 8. Gerar e Atualizar o Token JWT no Insomnia

1. Com a aplicação rodando (`npm run start:dev`), acesse a rota `POST /auth/signup` dentro do Insomnia.
2. Envie as credenciais desejadas (usuario_email e usuario_senha).
3. Copie o token JWT retornado na resposta.
4. No Insomnia, clique no ícone de engrenagem (⚙️) ao lado do nome do ambiente e selecione **Edit Environment**.
5. Atualize a variável `access_token` da seguinte forma:
6. Após gerar o primeiro token, atualize-o via `POST /auth/signin` informando as credenciais cadastradas
```json
{
  "access_token": "SEU_TOKEN_JWT_AQUI"
}

