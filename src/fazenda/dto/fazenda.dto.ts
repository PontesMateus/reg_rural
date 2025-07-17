import { IsNumber, IsString } from "class-validator"

export class fazendaDto {
    @IsNumber()
    produtor_id: number

    @IsNumber()
    estado_id: number

    @IsNumber()
    cidade_id: number

    @IsString()
    fazenda_descricao: string

    @IsNumber()
    fazenda_area_total: number

    @IsNumber()
    fazenda_area_agr: number
    
    @IsNumber()
    fazenda_area_veg: number
}