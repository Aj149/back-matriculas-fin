import {
  PrimaryGeneratedColumn,  
  Entity,
  ManyToMany,
  JoinTable,
  OneToOne,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HorarioEntity } from './horario.entity';
import { MatriculaEntity } from './matricula.entity';

@Entity('programacion', {schema: 'sistema' })
export class ProgramacionEntity {

  @PrimaryGeneratedColumn('increment')
  id_programacion: number;

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


  //1 establece una relación compleja many-to-many con HorarioEntity, 
  //1 La opción { eager: true } asegura que los 
  //1 datos relacionados se carguen automáticamente cuando se accede al objeto 
  //1 ProgramacionEntity, facilitando el desarrollo de consultas y operaciones 
  //1 relacionales en tu aplicación.
  @ManyToMany(() => HorarioEntity, (horario) => horario.programacion,{
    eager: true,
  })

  @JoinTable({
    name: 'programacion_horario',  //1nombre de la tabla
    joinColumn: { name: 'programacion_id' }, //1programacion_id es el nombre de la columna que almacena los ID de las instancias de ProgramacionEntity en la tabla de unión.
    inverseJoinColumn: { name: 'horario_id' },
  })
  horario: HorarioEntity[]; //1horario es una colección (o arreglo) que puede contener múltiples objetos de tipo HorarioEntity

  @OneToOne(() => MatriculaEntity, matricula => matricula.programacion)
  matricula: MatriculaEntity; //1relacion uno a uno entre la tabla programcion y matricula
}
