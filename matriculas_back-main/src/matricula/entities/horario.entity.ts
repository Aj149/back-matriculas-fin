import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AulaEntity } from './aula.entity';
import { Dia } from '../enums/dia';
import { Modalidad } from '../enums/modalidad';
import { ProgramacionEntity } from './programacion.entity';

@Entity('horario', { schema: 'sistema' })
export class HorarioEntity {
  @PrimaryGeneratedColumn('increment')
  id_horario: number;

  @Column('varchar', { length: 50, nullable: false })
  dia: Dia;

  @Column('time', { nullable: false })
  horaInicio: string;

  @Column('time', { nullable: false })
  horaSalida: string;

  @Column('varchar', { length: 50, nullable: true })
  modalidad: Modalidad;  

  @Column('int', { nullable: true })
  horasDiarias: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de creación del horario',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de actualización del horario',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    comment: 'Fecha de eliminación del horario',
  })
  deletedAt: Date;

  @ManyToOne(() => AulaEntity, (aula) => aula.horarios)
  @JoinColumn({ name: 'aula' })
  aula: AulaEntity;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    comment: 'true=activo, false=inactivo',
  })
  isActive: boolean;

  @ManyToMany(() => ProgramacionEntity, (programacion) => programacion.horario)
  programacion: ProgramacionEntity[];
}
