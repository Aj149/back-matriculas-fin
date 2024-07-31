import { Module } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { MatriculaController } from './matricula.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { AulaEntity } from './entities/aula.entity';
import { HorarioEntity } from './entities/horario.entity';
import { MateriaEntity } from './entities/materia.entity';
import { MatriculaEntity } from './entities/matricula.entity';
import { ProgramacionEntity } from './entities/programacion.entity';
import { EstudianteEntity } from 'src/estudiante/entities/estudiante.entity';
import { AulaService } from './services/aulas.service';
import { HorarioService } from './services/horarios.service';
import { MateriaService } from './services/materias.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    UsuarioEntity,
    MatriculaEntity,
    ProgramacionEntity,
    HorarioEntity,
    AulaEntity,
    MateriaEntity,
    EstudianteEntity,    
  ])],
  controllers: [MatriculaController],
  providers: [
    MatriculaService,
    AulaService,
    HorarioService,
    MateriaService    
  ],
})
export class MatriculaModule {}
