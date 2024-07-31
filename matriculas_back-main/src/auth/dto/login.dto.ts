import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/decorators/is-not-blank.decorator';

export class LoginUsuarioDto {

  @IsNotBlank({ message: 'el nombre de usuario no puede estar vacío' })  
  @IsString()
  nombres_usuario: string;

  @IsNotBlank({ message: 'la contraseña del usuario no puede estar vacía' })
  password: string;
}
