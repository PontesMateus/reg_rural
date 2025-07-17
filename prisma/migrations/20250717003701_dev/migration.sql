-- CreateTable
CREATE TABLE "usuarios" (
    "usuario_id" SERIAL NOT NULL,
    "usuario_data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "usuario_nome" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "estado" (
    "estado_id" INTEGER NOT NULL,
    "estado_nome" TEXT NOT NULL,
    "estado_sigla" TEXT NOT NULL,

    CONSTRAINT "estado_pkey" PRIMARY KEY ("estado_id")
);

-- CreateTable
CREATE TABLE "cidade" (
    "cidade_id" INTEGER NOT NULL,
    "cidade_nome" TEXT NOT NULL,
    "estado_id" INTEGER NOT NULL,

    CONSTRAINT "cidade_pkey" PRIMARY KEY ("cidade_id")
);

-- CreateTable
CREATE TABLE "cultura" (
    "cultura_id" SERIAL NOT NULL,
    "cultura_descricao" TEXT NOT NULL,

    CONSTRAINT "cultura_pkey" PRIMARY KEY ("cultura_id")
);

-- CreateTable
CREATE TABLE "safra" (
    "safra_id" SERIAL NOT NULL,
    "safra_ano" INTEGER NOT NULL,

    CONSTRAINT "safra_pkey" PRIMARY KEY ("safra_id")
);

-- CreateTable
CREATE TABLE "produtor" (
    "produtor_id" SERIAL NOT NULL,
    "produtor_nome" TEXT NOT NULL,
    "produtor_cpf" TEXT,
    "produtor_cnpj" TEXT,
    "estado_id" INTEGER NOT NULL,
    "cidade_id" INTEGER NOT NULL,

    CONSTRAINT "produtor_pkey" PRIMARY KEY ("produtor_id")
);

-- CreateTable
CREATE TABLE "fazenda" (
    "fazenda_id" SERIAL NOT NULL,
    "produtor_id" INTEGER NOT NULL,
    "estado_id" INTEGER NOT NULL,
    "cidade_id" INTEGER NOT NULL,
    "fazenda_descricao" TEXT NOT NULL,
    "fazenda_area_total" DECIMAL(10,2) NOT NULL,
    "fazenda_area_agr" DECIMAL(10,2) NOT NULL,
    "fazenda_area_veg" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "fazenda_pkey" PRIMARY KEY ("fazenda_id")
);

-- CreateTable
CREATE TABLE "fazenda_cultura_safra" (
    "fazenda_id" INTEGER NOT NULL,
    "cultura_id" INTEGER NOT NULL,
    "safra_id" INTEGER NOT NULL,

    CONSTRAINT "fazenda_cultura_safra_pkey" PRIMARY KEY ("fazenda_id","cultura_id","safra_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "cidade" ADD CONSTRAINT "cidade_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("estado_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtor" ADD CONSTRAINT "produtor_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("cidade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtor" ADD CONSTRAINT "produtor_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("estado_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fazenda" ADD CONSTRAINT "fazenda_produtor_id_fkey" FOREIGN KEY ("produtor_id") REFERENCES "produtor"("produtor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fazenda" ADD CONSTRAINT "fazenda_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("estado_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fazenda" ADD CONSTRAINT "fazenda_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("cidade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fazenda_cultura_safra" ADD CONSTRAINT "fazenda_cultura_safra_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazenda"("fazenda_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fazenda_cultura_safra" ADD CONSTRAINT "fazenda_cultura_safra_cultura_id_fkey" FOREIGN KEY ("cultura_id") REFERENCES "cultura"("cultura_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fazenda_cultura_safra" ADD CONSTRAINT "fazenda_cultura_safra_safra_id_fkey" FOREIGN KEY ("safra_id") REFERENCES "safra"("safra_id") ON DELETE RESTRICT ON UPDATE CASCADE;
