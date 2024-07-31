import { IsPositive, IsString } from "class-validator";

export class CreateAulaDto {
    
    @IsString()
    nombreAula: string;

    @IsPositive()
    capacidad: number;

}
