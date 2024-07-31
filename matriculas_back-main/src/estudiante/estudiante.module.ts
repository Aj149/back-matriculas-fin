import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './entities/estudiante.entity';
import { RepresentanteEntity } from './entities/representante.entity';
import { DireccionEstudianteEntity } from './entities/direccion_estudiante.entity';
import { InstitucionEntity } from './entities/institucion.entity';
import { MatriculaEntity } from 'src/matricula/entities/matricula.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    EstudianteEntity,
    RepresentanteEntity,
    DireccionEstudianteEntity,
    InstitucionEntity,
    MatriculaEntity
  ])],
  controllers: [EstudianteController],
  providers: [EstudianteService],
})
export class EstudianteModule {}
