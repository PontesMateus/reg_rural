import { IsNotEmpty, IsNumber , IsOptional, IsString } from "class-validator"

export class ProdutorDto {
    @IsString()
    @IsNotEmpty()
    produtor_nome: string

    @IsString()
    @IsOptional()
    produtor_cpf?: string

    @IsString()
    @IsOptional()
    produtor_cnpj?: string

    @IsNumber()
    estado_id: number

    @IsNumber()
    cidade_id: number
}