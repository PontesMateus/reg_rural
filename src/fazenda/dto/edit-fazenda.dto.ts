import { IsNumber, IsOptional, IsString } from "class-validator"

export class editFazendaDto {
    @IsNumber()
    @IsOptional()
    produtor_id?: number

    @IsString()
    @IsOptional()
    fazenda_descricao?: string

    @IsNumber()
    @IsOptional()
    fazenda_area_total?: number

    @IsNumber()
    @IsOptional()
    fazenda_area_agr?: number

    @IsNumber()
    @IsOptional()
    fazenda_area_veg?: number
}