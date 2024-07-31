import { RolEntity } from 'src/rol/entities/rol.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  JoinTable,
  ManyToMany,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { MateriaEntity } from 'src/matricula/entities/materia.entity';
import { MatriculaEntity } from 'src/matricula/entities/matricula.entity';
import { InformeEntity } from 'src/informe/entities/informe.entity';

@Entity('usuario', {schema: 'usuario' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn('increment')
  id_usuario: number;

  @Column({ type: 'varchar' })
  nombres_usuario: string;

  @Column({ type: 'varchar' })
  cedula: string;

  @Column({ type: 'varchar' })
  password: string;

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

  //foreing
  @ManyToMany(() => RolEntity, (rol) => rol.usuarios, { eager: true })
  @JoinTable({
    name: 'usuario_rol',
    joinColumn: { name: 'usuario_id' },
    inverseJoinColumn: { name: 'rol_id' },
  })
  roles: RolEntity[];

  @ManyToMany(() => MateriaEntity, (materia) => materia.profesor, {
    eager: true,
  })
  @JoinTable({
    name: 'usuario_materia',
    joinColumn: { name: 'usuario_id' },
    inverseJoinColumn: { name: 'materia_id' },
  })
  materia: MateriaEntity[];

  //relations
  @OneToMany(() => MatriculaEntity, (matricula) => matricula.profesor)
  matricula: MatriculaEntity[];

  @OneToMany(() => InformeEntity, (informe) => informe.instructor)
  informe: InformeEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPasword() {
    if (!this.password) return;
    this.password = await hash(this.password, 10);
  }
}
