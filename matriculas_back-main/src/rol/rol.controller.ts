import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';


@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Get()
  getRolList() {
      return this.rolService.getall()
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  createRol(@Body() nuevoRol: CreateRolDto) {
      return this.rolService.create(nuevoRol)
  }
}
