import { Type } from "class-transformer";
import { IsEmail, IsPositive, IsString, ValidateNested } from "class-validator";
import { CreateDireccionDto } from "./direccion/create-direccion.dto";
import { CreateInstitucionDto } from "./institucion/creadte_institucion.dto";
import { CreateRepresentanteDto } from "./representante/create_representante.dto";

export class CreateEstudianteDto {
    
    @IsString()
    nombre_estudiante: string;

    @IsString()
    cedula_estudiante: string;
  
    @IsEmail()
    email_estudiante: string;
  
    @IsPositive()
    edad_estudiante: number;
  
    @IsString()
    numero_estudiante: string;

    @ValidateNested()
    @Type(() => CreateRepresentanteDto)
    representante: CreateRepresentanteDto;
  
    @ValidateNested()
    @Type(() => CreateDireccionDto)
    direccion: CreateDireccionDto;
  
    @ValidateNested()
    @Type(() => CreateInstitucionDto)
    institucion: CreateInstitucionDto;
}
