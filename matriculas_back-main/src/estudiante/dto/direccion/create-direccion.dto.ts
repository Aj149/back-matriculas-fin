import { IsEnum, IsString } from "class-validator";
import { Sector } from "src/estudiante/enums/sector";

export class CreateDireccionDto {
   
    @IsString()
    ciudad: string;
  
    @IsEnum(Sector, { message: 'solo norte, sur centro y valle' })
    sector: Sector;
  
    @IsString()
    detalle: string;
}