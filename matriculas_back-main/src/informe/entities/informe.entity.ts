import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('informe', {schema: 'informe'  })
export class InformeEntity {
    @PrimaryGeneratedColumn()
    id_informe: number;

    @Column({ type: 'varchar' })
    estudiante: string;

    @Column({ type: 'date' })
    fecha: Date;

    @ManyToOne(() => UsuarioEntity, (profesor) => profesor.informe)
    @JoinColumn({ name: 'docente' })     
    instructor: UsuarioEntity;

    @Column({ type: 'varchar' })
    hora: string;

    @Column({ type: 'varchar' })
    codigo: string;

    @Column({ type: 'varchar' })
    materia: string;

    @Column({ type: 'varchar' })
    tema_general: string;

    @Column({ type: 'varchar' })
    tema_secundario: string;

    @Column({ type: 'varchar' })
    actitud_estudiante: string;

    @Column({ type: 'varchar' })
    tareas_enviadas: string;

    @Column({ type: 'varchar' })
    bases: string;

    @Column({ type: 'varchar' })
    tareas: string;

    @Column({ type: 'varchar' })
    evolucion: string;

    @Column({ type: 'timestamp' })
    hora_fecha_llamada: Date;

    @Column({ type: 'varchar' })
    representante: string;

    @Column({ type: 'varchar' })
    observaciones: string;

    @Column({ type: 'varchar' })
    realizado_por: string;
}