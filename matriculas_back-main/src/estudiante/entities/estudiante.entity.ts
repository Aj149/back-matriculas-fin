import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,  
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,     
} from 'typeorm';
import { InstitucionEntity } from './institucion.entity';
import { DireccionEstudianteEntity } from './direccion_estudiante.entity';
import { RepresentanteEntity } from './representante.entity';
import { MatriculaEntity } from 'src/matricula/entities/matricula.entity';

@Entity('estudiante', {schema: 'estudiante' })
export class EstudianteEntity {
  @PrimaryGeneratedColumn('increment')
  id_estudiante: number;

  @Column({ type: 'varchar' })
  nombre_estudiante: string;

  @Column({ type: 'varchar' })
  cedula_estudiante: string;

  @Column({ type: 'varchar' })
  email_estudiante: string;

  @Column({ type: 'integer' })
  edad_estudiante: number;

  @Column({ type: 'varchar' })
  numero_estudiante: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    comment: 'true=activo, false=inactivo',
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de creacion de la carrera',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de actualizacion de la carrera',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    comment: 'Fecha de eliminacion de la carrera',
  })
  deletedAt: Date;

  @ManyToOne(() => RepresentanteEntity, representante => representante.estudiantes, { cascade: true })
  representante: RepresentanteEntity;

  @ManyToOne(() => InstitucionEntity, (institucion) => institucion.estudiantes, { cascade: true })
  institucion: InstitucionEntity;

  @ManyToOne(() => DireccionEstudianteEntity, { cascade: true })
  direccion: DireccionEstudianteEntity;

  @OneToMany(() => MatriculaEntity, (matricula) => matricula.alumno,)  
  matricula: MatriculaEntity[];
}
