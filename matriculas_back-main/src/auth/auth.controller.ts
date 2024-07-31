import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUsuarioDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { AddRelationshipsDto,} from './dto/agregar.dto';
import { RolDecorator } from 'src/decorators/rol.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/rol.guard';
import { RolNombre } from 'src/rol/rol.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get(':id_usuario')
  findOne(@Param('id_usuario') id: number) {
    return this.authService.findOne(+id);
  }

  @Patch(':id_usuario')
  update(
    @Param('id_usuario') id: number,
    @Body() updateAuthDto: UpdateAuthDto,
  ) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id_usuario')
  remove(@Param('id_usuario') id: number) {
    return this.authService.remove(+id);
  }

  @Post('login')
  login(@Body() dto: LoginUsuarioDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: TokenDto) {
    return this.authService.refresh(dto);
  }

  @Put(':id_usuario/add')
  async addRelationships(
    @Param('id_usuario', ParseIntPipe) id_usuario: number,
    @Body() dto: AddRelationshipsDto,
  ) {
    return this.authService.addRelationships(id_usuario, dto);
  }
 
}
