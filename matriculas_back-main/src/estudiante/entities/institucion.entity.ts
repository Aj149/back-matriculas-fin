import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EstudianteEntity } from "./estudiante.entity";
import { TipoInstitucion } from "../enums/tipoInstitucion";
import { NivelInstitucion } from "../enums/nivel";
import { Jornada } from "../enums/jornada";

@Entity('institucion', {schema: 'estudiante' })
export class InstitucionEntity {
    @PrimaryGeneratedColumn('increment')
    id_institucion: number;

    @Column({ type: 'varchar' })
    nombre: string;

    @Column({ type: 'varchar' })
    tipo: TipoInstitucion;

    @Column({ type: 'varchar' })
    nivel: NivelInstitucion;

    @Column({ type: 'varchar' })
    grado: string;
    
    @Column({ type: 'varchar' })
    jornada: Jornada;   
    
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

    @OneToMany(() => EstudianteEntity, estudiante => estudiante.institucion)
    estudiantes: EstudianteEntity[];
}