import { IsEmail, IsString } from "class-validator";

export class CreateRepresentanteDto {
   
    @IsString()
    nombre_representante: string;

    @IsString()
    cedula_representante: string;
  
    @IsEmail()
    email_representante: string;
  
    @IsString()
    numero_representante: string;
    
}