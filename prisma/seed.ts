// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const estados = [
    { estado_id: 12, estado_nome: 'Acre', estado_sigla: 'AC' },
    { estado_id: 27, estado_nome: 'Alagoas', estado_sigla: 'AL' },
    { estado_id: 13, estado_nome: 'Amazonas', estado_sigla: 'AM' },
    { estado_id: 16, estado_nome: 'Amapá', estado_sigla: 'AP' },
    { estado_id: 29, estado_nome: 'Bahia', estado_sigla: 'BA' },
    { estado_id: 23, estado_nome: 'Ceará', estado_sigla: 'CE' },
    { estado_id: 53, estado_nome: 'Distrito Federal', estado_sigla: 'DF' },
    { estado_id: 32, estado_nome: 'Espírito Santo', estado_sigla: 'ES' },
    { estado_id: 52, estado_nome: 'Goiás', estado_sigla: 'GO' },
    { estado_id: 21, estado_nome: 'Maranhão', estado_sigla: 'MA' },
    { estado_id: 31, estado_nome: 'Minas Gerais', estado_sigla: 'MG' },
    { estado_id: 50, estado_nome: 'Mato Grosso do Sul', estado_sigla: 'MS' },
    { estado_id: 51, estado_nome: 'Mato Grosso', estado_sigla: 'MT' },
    { estado_id: 15, estado_nome: 'Pará', estado_sigla: 'PA' },
    { estado_id: 25, estado_nome: 'Paraíba', estado_sigla: 'PB' },
    { estado_id: 26, estado_nome: 'Pernambuco', estado_sigla: 'PE' },
    { estado_id: 22, estado_nome: 'Piauí', estado_sigla: 'PI' },
    { estado_id: 41, estado_nome: 'Paraná', estado_sigla: 'PR' },
    { estado_id: 33, estado_nome: 'Rio de Janeiro', estado_sigla: 'RJ' },
    { estado_id: 24, estado_nome: 'Rio Grande do Norte', estado_sigla: 'RN' },
    { estado_id: 43, estado_nome: 'Rio Grande do Sul', estado_sigla: 'RS' },
    { estado_id: 11, estado_nome: 'Rondônia', estado_sigla: 'RO' },
    { estado_id: 14, estado_nome: 'Roraima', estado_sigla: 'RR' },
    { estado_id: 42, estado_nome: 'Santa Catarina', estado_sigla: 'SC' },
    { estado_id: 28, estado_nome: 'Sergipe', estado_sigla: 'SE' },
    { estado_id: 35, estado_nome: 'São Paulo', estado_sigla: 'SP' },
    { estado_id: 17, estado_nome: 'Tocantins', estado_sigla: 'TO' },
];

const culturas = [
    { cultura_id: 1, cultura_descricao: 'Café' },
    { cultura_id: 2, cultura_descricao: 'Milho' },
    { cultura_id: 3, cultura_descricao: 'Soja' },
    { cultura_id: 4, cultura_descricao: 'Morango' },
]

const safras = [
    { safra_id: 1, safra_ano: 2022 },
    { safra_id: 2, safra_ano: 2023 },
    { safra_id: 3, safra_ano: 2024 },
    { safra_id: 4, safra_ano: 2025 },
]

async function main() {
    for (const estado of estados) {
        await prisma.estado.upsert({
            where: { estado_id: estado.estado_id },
            update: {},
            create: estado,
        });
    }
    for (const cultura of culturas) {
        await prisma.cultura.upsert({
            where: { cultura_id: cultura.cultura_id },
            update: {},
            create: cultura,
        })
    }
    for (const safra of safras) {
        await prisma.safra.upsert({
            where: { safra_id: safra.safra_id },
            update: {},
            create: safra,
        })
    }
}

main()
    .then(() => {
        console.log('Dados inseridos com sucesso!');
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
