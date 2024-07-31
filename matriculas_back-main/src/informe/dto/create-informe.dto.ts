import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsValidDate } from "src/decorators/is-valid-date";

export class CreateInformeDto {

    @IsNotEmpty()
    @IsString()
    estudiante: string;

    @IsNotEmpty({ message: 'La fecha no puede estar vacía' })
    @IsValidDate()
    fecha: Date;

    @IsNotEmpty({ message: 'El instructor no puede estar vacio' })
    @IsInt({ message: 'El instructor debe ser un número entero'})
    instructor: number;

    @IsNotEmpty({ message: 'La hora no puede estar vacía'})
    @IsString()
    hora: string;

    @IsNotEmpty({ message: 'El codigo no puede estar vacío'})
    @IsString()
    codigo: string;

    @IsNotEmpty({ message: 'La materia no puede estar vacía'})
    @IsString()
    materia: string;

    @IsNotEmpty({message: 'el tem general no puede estar vacio'} )
    @IsString()
    tema_general: string;

    @IsNotEmpty({message: 'el tema secundario no puede estar vacio'})
    @IsString()
    tema_secundario: string;

    @IsNotEmpty({ message: 'La actividad no puede estar vacía'})
    @IsString()
    actitud_estudiante: string;

    @IsNotEmpty({ message: 'La actividad no puede estar vacía'})
    @IsString()
    tareas_enviadas: string;

    @IsNotEmpty({ message: 'La actividad no puede estar vacía'})
    @IsString()
    bases: string;


    @IsNotEmpty({ message: 'La actividad no puede estar vacía'})
    @IsString()
    tareas: string;

    @IsNotEmpty({ message: 'La actividad no puede estar vacía'})
    @IsString()
    evolucion: string;

    @IsOptional()
    @IsString()
    hora_fecha_llamada: Date;

    @IsOptional()
    @IsString()
    representante: string;

    @IsOptional()
    @IsString()
    observaciones: string;

    @IsOptional()
    @IsString()
    realizado_por: string;
}