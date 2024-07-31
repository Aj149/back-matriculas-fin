import { Injectable, NotFoundException } from "@nestjs/common";
import { MateriaEntity } from "../entities/materia.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MessageDto } from "src/common/message.dto";
import { CreateMateriaDto } from "../dto/materia/create-materia.dto";

@Injectable()
export class MateriaService {
    constructor(
        @InjectRepository(MateriaEntity)
        private readonly materiaRepository: Repository<MateriaEntity>
    ) { } 

    async createMateria(createMateriaDto: CreateMateriaDto) {
        const materia = await this.materiaRepository.create(createMateriaDto);
        await this.materiaRepository.save(materia);
        return new MessageDto(`materia ${materia.nombre} creado`);
      }
    
      async finAllMateria() {
        const list = await this.materiaRepository.find();
        if (!list.length) {
          throw new NotFoundException(new MessageDto('no hay materias'));
        }
        list.sort((a, b) => b.id_materia - a.id_materia);
        return list;
      }
    
      async findOneMateria(id_materia: number) {
        const materia = await this.materiaRepository.findOne({
          where: { id_materia: id_materia },
        });
        if (!materia) {
          throw new NotFoundException(new MessageDto('no existe'));
        }
        return materia;
      }
    



      
      async updateMateria(id_materia: number, updateMateriaDto: CreateMateriaDto) {
        const materia = await this.findOneMateria(id_materia);
        if (!materia) {
          throw new NotFoundException(new MessageDto('No existe la materia'));
        }
        Object.assign(materia, updateMateriaDto);
        await this.materiaRepository.save(materia);
        return new MessageDto(`Materia ${materia.nombre} actualizada.`);
      }





    
      async removeMateria(id_materia: number) {
        const materia = await this.findOneMateria(id_materia);
        await this.materiaRepository.softRemove(materia);
        return new MessageDto(`materia ${materia.nombre} eliminado`);
      }
}