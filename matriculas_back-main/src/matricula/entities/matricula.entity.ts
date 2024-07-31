import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ProgramacionEntity } from './programacion.entity';
import { EstudianteEntity } from 'src/estudiante/entities/estudiante.entity';
import { MateriaEntity } from './materia.entity';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { Turno } from '../enums/turno.enum';

@Entity('matricula', { schema: 'sistema' })
export class MatriculaEntity {
  @PrimaryGeneratedColumn('increment')
  id_matricula: number;

  @Column('date')
  fecha: Date;

  @Column('date')
  fechaInicio: Date;

  @Column('date')
  fechaFinal: Date;

  @Column('varchar', { length: 50, nullable: false })
  turno: Turno;

  @Column('int', { nullable: true })
  cantidad: number;

  @Column({ type: 'float', nullable: false })
  precio: number;

  @Column({ type: 'float', nullable: false })
  valorHoras: number;

  @Column({ type: 'float', nullable: true })
  valorMateriales: number;

  @Column({ type: 'boolean', nullable: false })
  conIva: boolean;

  @Column({ type: 'float', nullable: false })
  valorTotal: number;

  @Column('varchar', { length: 50, nullable: false })
  observaciones

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
    comment: 'Fecha de creación de la matrícula',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de actualización de la matrícula',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    comment: 'Fecha de eliminación de la matrícula',
  })
  deletedAt: Date;

  @ManyToMany(() => MateriaEntity, (materia) => materia.matriculas)
  @JoinTable({
    name: 'matricula_materia',
    joinColumn: {
      name: 'matricula_id',
      referencedColumnName: 'id_matricula',
    },
    inverseJoinColumn: {
      name: 'materia_id',
      referencedColumnName: 'id_materia',
    },
  })
  materias: MateriaEntity[];

  @ManyToOne(() => EstudianteEntity, (estudiante) => estudiante.matricula, {
    eager: true,
  })
  @JoinColumn({ name: 'alumno' })
  alumno: EstudianteEntity;

  @ManyToOne(() => UsuarioEntity, (profesor) => profesor.matricula, {
    eager: true,
  })
  @JoinColumn({ name: 'profesor' })
  profesor: UsuarioEntity;

  @OneToOne(() => ProgramacionEntity, (programacion) => programacion.matricula, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'programacion_id' })
  programacion: ProgramacionEntity;

  calcularTotalHoras(): number {
    const totalHoras = this.programacion.horario.reduce((total, horario) => total + horario.horasDiarias, 0);
    const total = totalHoras * (this.cantidad || 0);
    return total;
  }

  @BeforeInsert()
  @BeforeUpdate()
  roundValorTotal() {
    this.valorTotal = parseFloat(this.valorTotal.toFixed(2));
  }
}
