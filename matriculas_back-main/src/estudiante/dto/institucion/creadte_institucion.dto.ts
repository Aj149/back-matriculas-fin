import { IsEnum, IsString } from "class-validator";
import { Jornada } from "src/estudiante/enums/jornada";
import { NivelInstitucion } from "src/estudiante/enums/nivel";
import { TipoInstitucion } from "src/estudiante/enums/tipoInstitucion";


export class CreateInstitucionDto {
   
    @IsString()
    nombre: string;

    @IsEnum(TipoInstitucion, { message: 'solo publica o privada' })
    tipo: TipoInstitucion;
    
    @IsEnum(NivelInstitucion, { message: 'solo escuela, colegio o universidad' })
    nivel: NivelInstitucion;

    @IsString()
    grado: string;
    
    @IsEnum(Jornada, { message: 'solo matutino, vespertino y nocturno' })
    jornada: Jornada;    
}