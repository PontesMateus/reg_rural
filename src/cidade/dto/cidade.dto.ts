import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CidadeDto {
  @IsNumber()
  @IsNotEmpty()
  cidade_id: number;

  @IsString()
  @IsNotEmpty()
  cidade_nome: string;
  
  @IsNumber()
  @IsNotEmpty()
  estado_id: number;


}
