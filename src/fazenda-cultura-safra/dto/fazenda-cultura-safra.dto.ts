import { IsNumber } from "class-validator"

export class fazendaCulturaSafraDto {
    @IsNumber()
    fazenda_id: number
    @IsNumber()
    cultura_id: number
    @IsNumber()
    safra_id: number
}