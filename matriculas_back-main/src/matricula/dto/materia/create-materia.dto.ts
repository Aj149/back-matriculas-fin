import { IsString } from "class-validator";

export class CreateMateriaDto {
   
    @IsString()
    nombre: string; 
    abreviatura: string;
}