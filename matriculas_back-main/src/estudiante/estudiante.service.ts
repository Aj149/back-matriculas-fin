import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DireccionEstudianteEntity } from './entities/direccion_estudiante.entity';
import { EstudianteEntity } from './entities/estudiante.entity';
import { InstitucionEntity } from './entities/institucion.entity';
import { RepresentanteEntity } from './entities/representante.entity';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
    @InjectRepository(RepresentanteEntity)
    private readonly representanteRepository: Repository<RepresentanteEntity>,
    @InjectRepository(DireccionEstudianteEntity)
    private readonly direccionRepository: Repository<DireccionEstudianteEntity>,
    @InjectRepository(InstitucionEntity)
    private readonly institucionRepository: Repository<InstitucionEntity>,
  ) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
    return this.estudianteRepository.manager.transaction(async (manager) => {
      const representante = await manager.save(
        this.representanteRepository.create(createEstudianteDto.representante),
      );
      const direccion = await manager.save(
        this.direccionRepository.create(createEstudianteDto.direccion),
      );
      const institucion = await manager.save(
        this.institucionRepository.create(createEstudianteDto.institucion),
      );

      const estudiante = await manager.save(
        this.estudianteRepository.create({
          ...createEstudianteDto,
          representante,
          direccion,
          institucion,
        }),
      );

      return estudiante;
    });
  }

  async findAll() {
    const list = await this.estudianteRepository.find({
      relations: ['representante', 'direccion', 'institucion'],
    });

    if (!list.length) {
      throw new NotFoundException(new MessageDto('No hay estudiantes'));
    }
    list.sort((a, b) => b.id_estudiante - a.id_estudiante);
    return list;
  }

  async findOne(id_estudiante: number) {
    const estu = await this.estudianteRepository.findOne({
      where: { id_estudiante: id_estudiante },
      relations: ['representante', 'direccion', 'institucion'],
    });

    if (!estu) {
      throw new NotFoundException(new MessageDto('No existe'));
    }
    return estu;
  }

  async update(
    id_estudiante: number,
    updateEstudianteDto: UpdateEstudianteDto,
  ) {
    return this.estudianteRepository.manager.transaction(async (manager) => {
      // Obtén el estudiante existente con sus relaciones
      const estudiante = await manager.findOne(EstudianteEntity, {
        where: { id_estudiante: id_estudiante },
        relations: ['representante', 'direccion', 'institucion'],
      });

      if (!estudiante) {
        // Manejo de error si el estudiante no se encuentra
        throw new NotFoundException(
          `Estudiante con ID ${id_estudiante} no encontrado`,
        );
      }

      // Actualiza las propiedades necesarias del estudiante
      manager.merge(EstudianteEntity, estudiante, updateEstudianteDto);

      // Actualiza el representante si existe
      if (estudiante.representante) {
        manager.merge(
          RepresentanteEntity,
          estudiante.representante,
          updateEstudianteDto.representante,
        );
        await manager.save(estudiante.representante);
      }

      // Actualiza la dirección si existe
      if (estudiante.direccion) {
        manager.merge(
          DireccionEstudianteEntity,
          estudiante.direccion,
          updateEstudianteDto.direccion,
        );
        await manager.save(estudiante.direccion);
      }

      // Actualiza la institución si existe
      if (estudiante.institucion) {
        manager.merge(
          InstitucionEntity,
          estudiante.institucion,
          updateEstudianteDto.institucion,
        );
        await manager.save(estudiante.institucion);
      }

      // Guarda el estudiante actualizado
      const estudianteActualizado = await manager.save(estudiante);

      return estudianteActualizado;
    });
  }

  async remove(id_estudiante: number) {
    return this.estudianteRepository.manager.transaction(async (manager) => {
      const estudiante = await manager.findOne(EstudianteEntity, {
        where: { id_estudiante: id_estudiante },
        relations: ['representante', 'direccion', 'institucion'],
      });

      if (!estudiante) {
        throw new NotFoundException(
          `Estudiante con ID ${id_estudiante} no encontrado`,
        );
      }

      // Eliminar el estudiante y las entidades relacionadas
      await manager.softRemove(EstudianteEntity, estudiante);

      // Si hay representante, dirección e institución, eliminarlos
      if (estudiante.representante) {
        await manager.softRemove(RepresentanteEntity, estudiante.representante);
      }

      if (estudiante.direccion) {
        await manager.softRemove(DireccionEstudianteEntity, estudiante.direccion);
      }

      if (estudiante.institucion) {
        await manager.softRemove(InstitucionEntity, estudiante.institucion);
      }

      return `Estudiante con ID ${id_estudiante} y entidades relacionadas eliminados correctamente`;
    });
  }
}