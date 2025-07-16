import { IsNumber, IsOptional, IsString } from "class-validator";

export class EditProdutorDto {
    @IsString()
    @IsOptional()
    produtor_nome: string

    @IsString()
    @IsOptional()
    produtor_cpf: string

    @IsString()
    @IsOptional()
    produtor_cnpj: string

    @IsNumber()
    @IsOptional()
    estado_id: number

    @IsNumber()
    @IsOptional()
    cidade_id: number
}