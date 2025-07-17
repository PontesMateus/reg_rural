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
    { cultura_descricao: 'Café' },
    { cultura_descricao: 'Milho' },
    { cultura_descricao: 'Soja' },
    { cultura_descricao: 'Morango' },
]

const safras = [
    { safra_ano: 2022 },
    { safra_ano: 2023 },
    { safra_ano: 2024 },
    { safra_ano: 2025 },
]

const cidades = [
    { cidade_id: 3509502, cidade_nome: 'Jundiaí', estado_id: 35 },
    { cidade_id: 3550308, cidade_nome: 'Sorocaba', estado_id: 35 },
    { cidade_id: 4106902, cidade_nome: 'Maringá', estado_id: 41 },
    { cidade_id: 4125506, cidade_nome: 'Toledo', estado_id: 41 },
    { cidade_id: 3118601, cidade_nome: 'Juiz de Fora', estado_id: 31 },
    { cidade_id: 3137007, cidade_nome: 'Uberlândia', estado_id: 31 },
];

const produtores = [
    { produtor_nome: 'Luiz Augusto Monteiro', produtor_cpf: '65295006697', estado_id: 31, cidade_id: 3118601 },
    { produtor_nome: 'Silvana Luna Flávia Oliveira', produtor_cpf: '33361289602', estado_id: 41, cidade_id: 4125506 },
]
const culturaFazendaSafras = [
    { fazenda_id: 2, cultura_id: 1, safra_id: 1 },
    { fazenda_id: 1, cultura_id: 3, safra_id: 2 },
    { fazenda_id: 3, cultura_id: 4, safra_id: 3 },
    { fazenda_id: 1, cultura_id: 3, safra_id: 4 },
    { fazenda_id: 4, cultura_id: 2, safra_id: 3 },
    { fazenda_id: 1, cultura_id: 2, safra_id: 4 },
    { fazenda_id: 4, cultura_id: 2, safra_id: 3 },
    { fazenda_id: 5, cultura_id: 4, safra_id: 1 },
]




async function main() {
    await prisma.estado.createMany({
        data: [...estados],
        skipDuplicates: true,
    });
    await prisma.cidade.createMany({
        data: [...cidades],
        skipDuplicates: true,
    });
    await prisma.cultura.createMany({
        data: [...culturas],
        skipDuplicates: true,
    })
    await prisma.safra.createMany({
        data: [...safras],
        skipDuplicates: true,
    })
    await prisma.produtor.createMany({
        data: [...produtores],
        skipDuplicates: true,
    })

    const produtoresDB = await prisma.produtor.findMany({
        where: {
            produtor_cpf: {
                in: produtores.map((p) => p.produtor_cpf),
            },
        },
    });



    const fazendas = [
        {
            produtor_id: produtoresDB.find(p => p.produtor_cpf === '65295006697')!.produtor_id,
            estado_id: 31,
            cidade_id: 3118601,
            fazenda_descricao: 'Luiz Fazenda 1',
            fazenda_area_total: 100,
            fazenda_area_agr: 60,
            fazenda_area_veg: 40
        },
        {
            produtor_id: produtoresDB.find(p => p.produtor_cpf === '65295006697')!.produtor_id,
            estado_id: 31,
            cidade_id: 3137007,
            fazenda_descricao: 'Luiz Fazenda 2',
            fazenda_area_total: 140,
            fazenda_area_agr: 70,
            fazenda_area_veg: 60
        },
        {
            produtor_id: produtoresDB.find(p => p.produtor_cpf === '65295006697')!.produtor_id,
            estado_id: 31,
            cidade_id: 3137007,
            fazenda_descricao: 'Luiz Fazenda 3',
            fazenda_area_total: 140,
            fazenda_area_agr: 70,
            fazenda_area_veg: 60
        },
        {
            produtor_id: produtoresDB.find(p => p.produtor_cpf === '33361289602')!.produtor_id,
            estado_id: 41,
            cidade_id: 4125506,
            fazenda_descricao: 'Silvana Fazenda 1',
            fazenda_area_total: 500,
            fazenda_area_agr: 350,
            fazenda_area_veg: 80
        },
        {
            produtor_id: produtoresDB.find(p => p.produtor_cpf === '33361289602')!.produtor_id,
            estado_id: 41,
            cidade_id: 4106902,
            fazenda_descricao: 'Silvana Fazenda 3',
            fazenda_area_total: 800,
            fazenda_area_agr: 600,
            fazenda_area_veg: 170
        },
    ]

    await prisma.fazenda.createMany({
        data: [...fazendas],
        skipDuplicates: true,
    });
    await prisma.fazendaCulturaSafra.createMany({
        data: [...culturaFazendaSafras],
        skipDuplicates: true,
    })
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
