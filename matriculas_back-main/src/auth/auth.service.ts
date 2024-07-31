/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RolEntity } from 'src/rol/entities/rol.entity';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { Repository } from 'typeorm';
import { MessageDto } from 'src/common/message.dto';
import { RolNombre } from 'src/rol/rol.enum';
import { LoginUsuarioDto } from './dto/login.dto';
import { compare } from 'bcryptjs';
import { PayloadInterface } from './payload.interface';
import { TokenDto } from './dto/token.dto';
import { HorarioEntity } from 'src/matricula/entities/horario.entity';
import { AddRelationshipsDto } from './dto/agregar.dto';
import { MateriaEntity } from 'src/matricula/entities/materia.entity';
import { EstudianteEntity } from 'src/estudiante/entities/estudiante.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(RolEntity)
    private readonly rolRepository: Repository<RolEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly authRepository: Repository<UsuarioEntity>,
    private readonly jwtService: JwtService,
    @InjectRepository(MateriaEntity)
    private readonly materiaRepository: Repository<MateriaEntity>,

) { }


  async create(dto: CreateAuthDto) {
    const { nombres_usuario, cedula } = dto;
    const exists = await this.authRepository.findOne({
      where: [{ nombres_usuario: nombres_usuario }, { cedula: cedula }],
    });
    if (exists)
      throw new BadRequestException(new MessageDto('ese usuario ya existe'));   
    const rolUser = await this.rolRepository.findOne({
      where: { rolNombre: RolNombre.USER },
    });
    if (!rolUser)
      throw new InternalServerErrorException(
        new MessageDto('los roles aún no han sido creados'),
      );
    const user = this.authRepository.create(dto);
    user.roles = [rolUser];
    await this.authRepository.save(user);
    return new MessageDto('usuario creado');
  }

 async findAll() {
    const usuarios = await this.authRepository.find();
    if (!usuarios.length)
      throw new NotFoundException(
        new MessageDto('no hay usuarios en la lista'),
      );
      usuarios.sort((a, b) => b.id_usuario - a.id_usuario);
    return usuarios;
  }

 async findOne(id_usuario: number) {
    const usuario = await this.authRepository.findOne({
      where: { id_usuario: id_usuario },
    });
    if (!usuario) {
      throw new NotFoundException(new MessageDto('No existe el usuario'));
    }
    return usuario;
  }

 async update(id_usuario: number, usuario: UpdateAuthDto) {
    const existingUser = await this.authRepository.findOne( { where: { id_usuario:id_usuario }, } );

    if (!existingUser) {
      throw new NotFoundException(new MessageDto('Usuario no encontrado'));    }   
    
    const { password, ...restoUsuario } = usuario;  
    this.authRepository.update(id_usuario, restoUsuario); 
    await this.authRepository.save(existingUser);    
    return new MessageDto(`Usuario editado ${restoUsuario.nombres_usuario} exitosamente`);
  }  

  async remove(id_usuario: number) {
    const user = await this.authRepository.findOne({
      where: { id_usuario:id_usuario },
    });
    if (!user) {
      throw new NotFoundException(new MessageDto('Usuario no encontrado'));
    }
  
    await this.authRepository.softRemove(user);
    return new MessageDto('Usuario eliminado exitosamente');
}

async addRelationships(id_usuario: number, dto: AddRelationshipsDto) {
  const { materias, } = dto;
  

  const user = await this.authRepository.findOne({ where: { id_usuario } });

  if (!user) {
    throw new NotFoundException(new MessageDto('Usuario no encontrado'));
  }

  // Cargar relaciones después de obtener el usuario 

  await this.authRepository
    .createQueryBuilder('user')
    .relation('materia')
    .of(user)
    .loadMany(); 

  // Agregar nuevas materias al usuario
  if (materias && materias.length) {
    const newMaterias = await this.materiaRepository.findByIds(materias);
    user.materia = [...user.materia, ...newMaterias];
  }
 
  await this.authRepository.save(user);

  return new MessageDto('Relaciones agregadas exitosamente');
}


async login(dto: LoginUsuarioDto): Promise<any> {
  const { nombres_usuario } = dto;
  const usuario = await this.authRepository.findOne({
    where: [{ nombres_usuario: nombres_usuario }, { cedula: nombres_usuario }],
  });
  if (!usuario)
    return new UnauthorizedException(new MessageDto('no existe el usuario'));
  const passwordOK = await compare(dto.password, usuario.password);
  if (!passwordOK)
    return new UnauthorizedException(new MessageDto('contraseña errónea'));
  const payload: PayloadInterface = {
    id_usuario: usuario.id_usuario,
    nombres_usuario: usuario.nombres_usuario,
    cedula: usuario.cedula,
    roles: usuario.roles.map((rol) => rol.rolNombre as RolNombre),    
  };
  const token = await this.jwtService.sign(payload);
  return { token };
}


async refresh(dto: TokenDto) {
  const usuario = await this.jwtService.decode(dto.token);
  const payload: PayloadInterface = {
    id_usuario: usuario[`id_usuarrio`],
    nombres_usuario: usuario[`nombres_usuario`],
    cedula: usuario[`cedula`],
    roles: usuario[`roles`],
  };
  const token = await this.jwtService.sign(payload);
  return { token };
}
}
