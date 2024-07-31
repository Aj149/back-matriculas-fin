import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInformeDto } from './dto/create-informe.dto';
import { UpdateInformeDto } from './dto/update-informe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InformeEntity } from './entities/informe.entity';
import { Repository } from 'typeorm';
import { MessageDto } from 'src/common/message.dto';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class InformeService {
  constructor(
    @InjectRepository(InformeEntity)
    private readonly informeRepository: Repository<InformeEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async createInforme(createInformeDto: CreateInformeDto) {
    const { instructor, ...resto } = createInformeDto;
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: instructor },
    });
    if (!usuario) {
      throw new NotFoundException(new MessageDto('No existe el instructor'));
    }
    const Informe = await this.informeRepository.create({
      ...resto,
      instructor: usuario,
    });
    const savedInforme = await this.informeRepository.save(Informe);
    return savedInforme;
  }

  async findAllInforme() {
    const informe = await this.informeRepository
      .createQueryBuilder('informe')
      .leftJoinAndSelect('informe.instructor', 'usuario')
      .getMany();

    if (!informe.length) {
      throw new NotFoundException(new MessageDto('No hay horarios'));
    }
    return informe;
  }

  async findInformeByInstructor(instructorId: number): Promise<InformeEntity[]> {
    // Efficiently fetch informes with eager loading of instructor details
    const informes = await this.informeRepository.find({
      where: { instructor: { id_usuario: instructorId } },
      relations: ['instructor'],
    });
  
    // Handle potential absence of informes
    if (!informes.length) {
      throw new NotFoundException(new MessageDto('No hay informes para este instructor'));
    }
  
    return informes;
  }
  

  async findOneInforme(id_informe: number) {
    const informe = await this.informeRepository
      .createQueryBuilder('informe')
      .leftJoinAndSelect('informe.instructor', 'usuario')
      .where('informe.id_informe = :id_informe', { id_informe })
      .getOne();

    if (!informe) {
      throw new NotFoundException(new MessageDto('No existe'));
    }

    return informe;
  }

  async updateInforme(id_informe: number, updateInformeDto: UpdateInformeDto) {
    const informe = await this.findOneInforme(id_informe);
    if (!informe) {
      throw new NotFoundException(new MessageDto('No existe el informe'));
    }
    Object.assign(informe, updateInformeDto);
    await this.informeRepository.save(informe);
    return new MessageDto(`Informe con ID ${informe.id_informe} actualizado`);
  }

  async removeInforme(id_informe: number) {
    const informe = await this.findOneInforme(id_informe);
    await this.informeRepository.delete(informe.id_informe);
    return new MessageDto(`Informe con ID ${informe.id_informe} eliminado`);
  }
}
