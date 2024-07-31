import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';

@Entity('representante', {schema: 'estudiante' })
export class RepresentanteEntity {
  @PrimaryGeneratedColumn('increment')
  id_representante: number;

  @Column({ type: 'varchar' })
  nombre_representante: string;

  @Column({ type: 'varchar' })
  cedula_representante: string;

  @Column({ type: 'varchar' })
  email_representante: string;

  @Column({ type: 'varchar' })
  numero_representante: string;

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

  @OneToMany(() => EstudianteEntity, (estudiantes) => estudiantes.representante)
  estudiantes: EstudianteEntity[];
}
