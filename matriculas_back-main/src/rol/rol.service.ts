import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolEntity } from './entities/rol.entity';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class RolService {

  constructor(
    @InjectRepository(RolEntity)
    private readonly rolRepository: Repository<RolEntity>
) { }

async getall(): Promise<RolEntity[]> {
  const roles = await this.rolRepository.find();
  if (!roles.length)
    throw new NotFoundException(new MessageDto('no hay roles en la lista'));
  return roles;
}

async create(dto: CreateRolDto) {
  const exists = await this.rolRepository.findOne({
    where: { rolNombre: dto.rolNombre },
  });
  if (exists)
    throw new BadRequestException(new MessageDto('ese rol ya existe'));
  await this.rolRepository.save(dto as RolEntity);
  return new MessageDto('rol creado');  
}

}
