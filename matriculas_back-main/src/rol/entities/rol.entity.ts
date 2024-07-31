import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolNombre } from "../rol.enum";
import { UsuarioEntity } from "src/usuario/entities/usuario.entity";

@Entity('rol',{schema: 'usuario' })
export class RolEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
    rolNombre: RolNombre;

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
  
    @ManyToMany(() => UsuarioEntity, (usuario) => usuario.roles)
    usuarios: UsuarioEntity[];
}
