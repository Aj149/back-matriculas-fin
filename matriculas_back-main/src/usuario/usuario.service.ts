/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { RolEntity } from 'src/rol/entities/rol.entity';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { RolNombre } from 'src/rol/rol.enum';

@Injectable()
export class UsuarioService {

  constructor(
    @InjectRepository(RolEntity)
    private readonly rolRepository: Repository<RolEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async findAll(): Promise<UsuarioEntity[]> {
    const usuarios = await this.usuarioRepository.find();
    if (!usuarios.length)
      throw new NotFoundException(
        new MessageDto('no hay usuarios en la lista'),
      );
    return usuarios;
  }

  async create(dto: CreateUsuarioDto) {
    const { nombres_usuario, cedula } = dto;
    const exists = await this.usuarioRepository.findOne({
      where: [{ nombres_usuario: nombres_usuario }, { cedula: cedula }],
    });
    if (exists)
      throw new BadRequestException(new MessageDto('ese usuario ya existe'));
    const rolAdmin = await this.rolRepository.findOne({
      where: { rolNombre: RolNombre.ADMIN },
    });
    const rolUser = await this.rolRepository.findOne({
      where: { rolNombre: RolNombre.USER },
    });
    if (!rolAdmin || !rolUser)
      throw new InternalServerErrorException(
        new MessageDto('los roles aún no han sido creados'),
      );
    const admin = this.usuarioRepository.create(dto);
    admin.roles = [rolAdmin, rolUser];
    await this.usuarioRepository.save(admin);
    return new MessageDto('admin creado');
  }

  async findOne(id_usuario: number) {
   const usuario = await this.usuarioRepository.findOne({
        where: {id_usuario: id_usuario},
    })
   if(!usuario){
    throw new NotFoundException(new MessageDto('No existe el usuario'));
   }  
   return usuario;
}

}
