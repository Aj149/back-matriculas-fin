import { IsPositive, IsString, IsNotEmpty} from "class-validator"; //"GENESIS" Se importa el IsNotEmpty//

export class CreateAulaDto {
    
    @IsString()
    nombreAula: string;

    @IsPositive()
    capacidad: number;

    @IsString() 
    @IsNotEmpty() 
    tipoAula: string; 
}