import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { MatriculaEntity } from './entities/matricula.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioEntity } from './entities/horario.entity';
import { MateriaEntity } from './entities/materia.entity';
import { ProgramacionEntity } from './entities/programacion.entity';
import { MessageDto } from 'src/common/message.dto';
import { EstudianteEntity } from 'src/estudiante/entities/estudiante.entity';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { AulaEntity } from './entities/aula.entity';

@Injectable()
export class MatriculaService {
  constructor(
    @InjectRepository(MatriculaEntity)
    private readonly matriculaRepository: Repository<MatriculaEntity>,
    @InjectRepository(ProgramacionEntity)
    private readonly programacionRepository: Repository<ProgramacionEntity>,
    @InjectRepository(HorarioEntity)
    private readonly horarioRepository: Repository<HorarioEntity>,
    @InjectRepository(MateriaEntity)
    private readonly materiaRepository: Repository<MateriaEntity>,
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(AulaEntity)
    private readonly aulaRepository: Repository<AulaEntity>,
  ) {}

  async create(dto: CreateMatriculaDto): Promise<MatriculaEntity> {
    const {
      id_estudiante,
      id_usuario,
      id_materias,
      programacion,
      precio,
      valorMateriales,
      conIva,
      ...matriculaData
    } = dto;

    const { horario_id, ...programacionData } = programacion;

    // Obtener entidades relacionadas
    const alumno = await this.estudianteRepository.findOne({
      where: { id_estudiante },
    });
    const profesor = await this.usuarioRepository.findOne({
      where: { id_usuario },
    });
    const materias = await this.materiaRepository.findByIds(id_materias);
    const horarios = await this.horarioRepository.findByIds(horario_id);

    if (!alumno) throw new NotFoundException('No existe el alumno');
    if (!profesor) throw new NotFoundException('No existe el profesor');
    if (materias.length === 0)
      throw new NotFoundException('No existen las materias especificadas');
    if (horarios.length === 0)
      throw new NotFoundException('No existen horarios');

    // Calcular la cantidad basada en la suma de horasDiarias
    const cantidad = horarios.reduce(
      (sum, horario) => sum + horario.horasDiarias,
      0,
    );

    // Crear instancia de ProgramacionEntity
    const nuevaProgramacion = this.programacionRepository.create({
      ...programacionData,
      horario: horarios,
    });

    // Guardar la programación
    const savedProgramacion =
      await this.programacionRepository.save(nuevaProgramacion);

    // Calcular valorHoras
    const valorHoras = precio * cantidad;

    // Calcular valorTotal
    let valorTotal = valorHoras;
    if (valorMateriales) {
      valorTotal += valorMateriales;
    }
    if (conIva) {
      const iva = valorTotal * 0.15;
      valorTotal += iva;
    }

    // Redondear valorTotal a dos decimales
    valorTotal = parseFloat(valorTotal.toFixed(2));

    // Crear instancia de MatriculaEntity
    const matricula = this.matriculaRepository.create({
      ...matriculaData,
      alumno,
      profesor,
      materias,
      programacion: savedProgramacion,
      cantidad,
      precio,
      valorHoras,
      valorMateriales,
      conIva,
      valorTotal,
    });

    // Guardar la matrícula
    const savedMatricula = await this.matriculaRepository.save(matricula);

    return savedMatricula;
  }

  async getMatriculasByUsuario(id_usuario: number): Promise<MatriculaEntity[]> {
    const matriculas = await this.matriculaRepository.find({
      where: { profesor: { id_usuario } },
      relations: [
        'alumno',
        'profesor',
        'materias',
        'programacion',
        'programacion.horario',
      ],
    });

    if (!matriculas.length) {
      throw new NotFoundException(
        `No hay matrículas para el usuario con ID ${id_usuario}`,
      );
    }

    // Cargar las aulas de los horarios
    for (const matricula of matriculas) {
      for (const horario of matricula.programacion.horario) {
        if (horario.modalidad === 'presencial') {
          const horarioConAula = await this.horarioRepository.findOne({
            where: { id_horario: horario.id_horario },
            relations: ['aula'],
          });
          horario.aula = horarioConAula.aula;
        }
      }
    }

    return matriculas;
  }

  async getHorariosByMatricula(idMatricula: number): Promise<HorarioEntity[]> {
    const matricula = await this.matriculaRepository.findOne({
      where: { id_matricula: idMatricula },
      relations: ['programacion', 'programacion.horario'],
    });

    if (!matricula) {
      throw new NotFoundException(
        `No existe la matrícula con ID ${idMatricula}`,
      );
    }

    return matricula.programacion.horario;
  }

  async getMateriasByMatricula(idMatricula: number): Promise<MateriaEntity[]> {
    const matricula = await this.matriculaRepository.findOne({
      where: { id_matricula: idMatricula },
      relations: ['materias'],
    });
    if (!matricula) {
      throw new NotFoundException(
        `No existe la matrícula con ID ${idMatricula}`,
      );
    }
    return matricula.materias;
  }
  

  async findAll() {
    const matricula = await this.matriculaRepository.find();
    if (!matricula.length)
      throw new NotFoundException(
        new MessageDto('no hay matriculas en la lista'),
      );
    matricula.sort((a, b) => b.id_matricula - a.id_matricula);
    return matricula;
  }

  async findOne(id_matricula: number) {
    const matricula = await this.matriculaRepository.findOne({
      where: { id_matricula: id_matricula },
      relations: [
        'alumno',
        'profesor',
        'materias',
        'programacion',
        'programacion.horario',
      ],
    });
    if (!matricula) {
      throw new NotFoundException(new MessageDto('No existe la matricula'));
    }

    // Cargar las aulas de los horarios
    for (const horario of matricula.programacion.horario) {
      if (horario.modalidad === 'presencial') {
        const horarioConAula = await this.horarioRepository.findOne({
          where: { id_horario: horario.id_horario },
          relations: ['aula'],
        });
        horario.aula = horarioConAula.aula;
      }
    }

    return matricula;
  }

  async update(id_matricula: number, dto: UpdateMatriculaDto) {
    const {
      id_estudiante,
      id_usuario,
      id_materias,
      programacion,
      precio,
      valorMateriales,
      conIva,
      ...matriculaData
    } = dto;

    return this.matriculaRepository.manager.transaction(async (manager) => {
      // Obtener la matrícula a actualizar
      const matricula = await manager.findOne(MatriculaEntity, {
        where: { id_matricula },
        relations: ['programacion', 'profesor', 'alumno', 'materias'],
      });

      if (!matricula) {
        throw new NotFoundException('No se encontró la matrícula');
      }

      // Obtener entidades relacionadas
      const alumno = id_estudiante
        ? await manager.findOne(EstudianteEntity, {
            where: { id_estudiante },
          })
        : matricula.alumno;

      const profesor = id_usuario
        ? await manager.findOne(UsuarioEntity, {
            where: { id_usuario },
          })
        : matricula.profesor;

      const materias = id_materias
        ? await manager.findByIds(MateriaEntity, id_materias)
        : matricula.materias;

      // Actualizar programación si existe
      if (programacion) {
        const { horario_id, ...programacionData } = programacion;

        // Obtener horarios
        const horarios = await manager.findByIds(HorarioEntity, horario_id);

        if (!matricula.programacion) {
          matricula.programacion = new ProgramacionEntity();
        }

        // Actualizar datos de la programación
        Object.assign(matricula.programacion, programacionData);
        matricula.programacion.horario = horarios;

        // Guardar los cambios en la entidad de Programacion
        await manager.save(matricula.programacion);
      }

      // Actualizar datos de la matrícula
      matricula.alumno = alumno;
      matricula.profesor = profesor;
      matricula.materias = materias;
      matricula.cantidad = matricula.programacion.horario.reduce(
        (sum, horario) => sum + horario.horasDiarias,
        0,
      );
      matricula.precio = precio !== undefined ? precio : matricula.precio;
      matricula.valorMateriales =
        valorMateriales !== undefined
          ? valorMateriales
          : matricula.valorMateriales;
      matricula.conIva = conIva !== undefined ? conIva : matricula.conIva;

      // Calcular valorHoras
      const valorHoras = matricula.precio * matricula.cantidad;

      // Calcular valorTotal
      let valorTotal = valorHoras;
      if (matricula.valorMateriales) {
        valorTotal += matricula.valorMateriales;
      }
      if (matricula.conIva) {
        const iva = valorTotal * 0.15;
        valorTotal += iva;
      }

      // Redondear valorTotal a dos decimales
      matricula.valorTotal = parseFloat(valorTotal.toFixed(2));

      // Aplicar otros datos de la matrícula
      Object.assign(matricula, matriculaData);

      // Guardar los cambios en la entidad de Matricula
      const updatedMatricula = await manager.save(matricula);

      return updatedMatricula;
    });
  }

  async remove(id_matricula: number): Promise<string> {
    return await this.matriculaRepository.manager.transaction(
      async (manager) => {
        const matricula = await manager.findOne(MatriculaEntity, {
          where: { id_matricula },
          relations: ['programacion', 'programacion.horario'],
        });

        if (!matricula) {
          throw new NotFoundException(
            `Matrícula con ID ${id_matricula} no encontrada`,
          );
        }

        if (matricula.programacion) {
          // Eliminar programacion_horario y programacion_aulas
          await manager
            .createQueryBuilder()
            .delete()
            .from('programacion_horario')
            .where('programacion_id = :id', {
              id: matricula.programacion.id_programacion,
            })
            .execute();

          // eliminar las matrículas relacionadas con la programación
          await manager.softRemove(MatriculaEntity, {
            programacion: {
              id_programacion: matricula.programacion.id_programacion,
            },
          });

          // Ahora es seguro eliminar la programación
          await manager.softRemove(ProgramacionEntity, matricula.programacion);
        }

        // Eliminar la matricula
        await manager.softRemove(MatriculaEntity, matricula);

        return ` Matrícula con ID ${id_matricula} eliminada correctamente`;
      },
    );
  }
}
