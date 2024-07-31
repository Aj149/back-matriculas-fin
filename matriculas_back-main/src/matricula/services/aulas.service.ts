import { Injectable, NotFoundException } from "@nestjs/common";
import { MessageDto } from "src/common/message.dto";
import { CreateAulaDto } from "../dto/aula/create-aula.dto";
import { AulaEntity } from "../entities/aula.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AulaService {

    constructor(
        @InjectRepository(AulaEntity)
        private readonly aulaRepository: Repository<AulaEntity>
    ) { }
        
     // Aulas
  async createAula(createAulaDto: CreateAulaDto) {
    const aula = this.aulaRepository.create(createAulaDto);
    await this.aulaRepository.save(aula);
    return new MessageDto(`aula creada ${aula.nombreAula}`);
  }

  async finAllAula() {
    const list = await this.aulaRepository.find();
    if (!list.length) {
      throw new NotFoundException(new MessageDto('no hay aulas'));
    }
    list.sort((a, b) => b.id_aula - a.id_aula);
    return list;
  }

  async findOneAula(id_aula: number) {
    const aula = await this.aulaRepository.findOne({
      where: { id_aula: id_aula },
    });
    if (!aula) {
      throw new NotFoundException(new MessageDto('no existe'));
    }
    return aula;
  }

  async updateAula(id_aula: number, updateAulaDto: CreateAulaDto) {
    const aula = await this.findOneAula(id_aula);
    if (!aula) {
      throw new NotFoundException(new MessageDto('No existe el aula.'));
    }
    Object.assign(aula, updateAulaDto);
    await this.aulaRepository.save(aula);
    return new MessageDto(`Aula ${aula.nombreAula} actualizada.`);
  }

  async removeAula(id_aula: number) {
    const aula = await this.findOneAula(id_aula);
    await this.aulaRepository.softRemove(aula);
    return new MessageDto(`aula ${aula.nombreAula} eliminado`);
  }
  
}