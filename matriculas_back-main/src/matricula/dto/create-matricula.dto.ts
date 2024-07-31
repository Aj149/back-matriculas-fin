import {
  IsNotEmpty,
  IsInt,
  ValidateNested,
  IsEnum,
  IsBoolean,  
  IsOptional, 
  IsArray,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidDate } from 'src/decorators/is-valid-date';
import { Turno } from '../enums/turno.enum';

class ProgramacionDto {

  @IsNotEmpty({ message: 'El horario_id no puede estar vacío.' })
  @IsInt({ each: true, message: 'Cada horario_id debe ser un número entero.' })
  horario_id: number[];
}

export class CreateMatriculaDto {
  @IsNotEmpty({ message: 'La fecha no puede estar vacía.' })
  @IsValidDate()
  fecha: Date;

  @IsNotEmpty({ message: 'La fechaInicio no puede estar vacía.' })
  @IsValidDate()
  fechaInicio: Date;

  @IsNotEmpty({ message: 'La fechaFinal no puede estar vacía.' })
  @IsValidDate()
  fechaFinal: Date; 

  @IsInt({ message: 'El id_estudiante debe ser un número entero.' })
  id_estudiante: number;

  @IsInt({ message: 'El id_usuario debe ser un número entero.' })
  id_usuario: number;

  @IsArray()
  @IsInt({ each: true, message: 'Cada id_materia debe ser un número entero.' })
  id_materias: number[];

  @ValidateNested()
  @Type(() => ProgramacionDto)
  programacion: ProgramacionDto;

  @IsEnum(Turno, { message: 'El turno debe ser uno de los siguientes valores: mañana, tarde o noche.' })
  turno: Turno;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @IsOptional()
  cantidad: number;

  @IsNumber()
  precio: number;

  @IsNumber()
  @IsOptional()
  valorMateriales: number;

  @IsBoolean({ message: 'conIva debe ser un valor booleano.' })
  @IsOptional()
  conIva: boolean; 

  @IsString()
  observaciones: string; 

}
