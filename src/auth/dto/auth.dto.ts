import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  usuario_email: string;

  @IsString()
  @IsNotEmpty()
  usuario_senha: string;
}
