import { IsNotBlank } from "src/decorators/is-not-blank.decorator";
import { IsValidPassword } from "src/decorators/is-valid-pass";

export class CreateAuthDto {
    @IsNotBlank({ message: 'el nombre de usuario no puede estar vacío' })    
    nombres_usuario: string;  
    
    @IsNotBlank({ message: 'la cédula no puede estar vacía' })
    cedula: string;
  
    @IsValidPassword({ message: ' la contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (@$!%*?&)', always: true })
    password: string;
   
}
