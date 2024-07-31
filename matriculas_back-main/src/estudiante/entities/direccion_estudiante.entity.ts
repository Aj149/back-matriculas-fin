import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Sector } from '../enums/sector';

@Entity('direccion_estudiante', {schema: 'estudiante' })
export class DireccionEstudianteEntity {
  
  @PrimaryGeneratedColumn('increment')
  id_direccion: number;

  @Column('varchar',{length: 50, nullable: false})
  ciudad: string;

  @Column('varchar', {length: 50, nullable: false})
  sector: Sector;

  @Column({ type: 'varchar', length: 300 })
  detalle: string;

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
}
