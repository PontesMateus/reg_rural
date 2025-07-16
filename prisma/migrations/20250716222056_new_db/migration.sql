/*
  Warnings:

  - Added the required column `cidade_id` to the `fazenda` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade_id` to the `produtor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fazenda" ADD COLUMN     "cidade_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "produtor" ADD COLUMN     "cidade_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "cidade" (
    "cidade_id" INTEGER NOT NULL,
    "cidade_nome" TEXT NOT NULL,
    "estado_id" INTEGER NOT NULL,

    CONSTRAINT "cidade_pkey" PRIMARY KEY ("cidade_id")
);

-- AddForeignKey
ALTER TABLE "cidade" ADD CONSTRAINT "cidade_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("estado_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtor" ADD CONSTRAINT "produtor_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("cidade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fazenda" ADD CONSTRAINT "fazenda_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("cidade_id") ON DELETE RESTRICT ON UPDATE CASCADE;
