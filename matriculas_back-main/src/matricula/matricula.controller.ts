import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { CreateAulaDto } from './dto/aula/create-aula.dto';
import { CreateMateriaDto } from './dto/materia/create-materia.dto';
import { CreateHorarioDto } from './dto/horario/create-horario.dto';
import { AulaService } from './services/aulas.service';
import { HorarioService } from './services/horarios.service';
import { MateriaService } from './services/materias.service';
import { Modalidad } from './enums/modalidad';
import { HorarioEntity } from './entities/horario.entity';
import { MatriculaEntity } from './entities/matricula.entity';
import { MateriaEntity } from './entities/materia.entity';

@UsePipes(ValidationPipe)
@Controller('matricula')
export class MatriculaController {
  constructor(
    private readonly matriculaService: MatriculaService,
    private readonly aulaService: AulaService,
    private readonly horarioService: HorarioService,
    private readonly materiaService: MateriaService,   
    ) {}

  //Aulas
  @Post('aula')
  createAula(@Body() createAulaDto: CreateAulaDto) {
    return this.aulaService.createAula(createAulaDto);
  }
  
  @Get('aula')
  findAllAula() {
    return this.aulaService.finAllAula();
  }

  @Get('aula/:id')
  findOneAula(@Param('id') id: string) {
    return this.aulaService.findOneAula(+id);
  }

  @Patch('aula/:id')
  updateAula(@Param('id') id: string, @Body() updateAulaDto: CreateAulaDto) {
    return this.aulaService.updateAula(+id, updateAulaDto);
  }

  @Delete('aula/:id')
  removeAula(@Param('id') id: string) {
    return this.aulaService.removeAula(+id);
  }

  //Materias

  @Post('materia')
  createMateria(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiaService.createMateria(createMateriaDto);
  }

  @Get('materia')
  findAllMateria() {
    return this.materiaService.finAllMateria();
  }

  @Get('materia/:id')
  findOneMateria(@Param('id') id: string) {
    return this.materiaService.findOneMateria(+id);
  }

  @Patch('materia/:id')
  updateMateria(@Param('id') id: string, @Body() updateMateriaDto: CreateMateriaDto) {
    return this.materiaService.updateMateria(+id, updateMateriaDto);
  }

  @Delete('materia/:id')
  removeMateria(@Param('id') id: string) {
    return this.materiaService.removeMateria(+id);
  }

  //Horarios

  @Post('horario')
  createHorario(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horarioService.createHorario(createHorarioDto);
  }

  @Get('horario')
  findAllHorario() {
    return this.horarioService.finAllHorario();
  }

  @Get('modalidad/:modalidad')
  async getAllHorariosByModalidad(@Param('modalidad') modalidad: Modalidad): Promise<CreateHorarioDto[]> {
    return await this.horarioService.getAllHorariosByModalidad(modalidad);
  }


  @Get('horario/:id')
  findOneHorario(@Param('id') id: string) {
    return this.horarioService.findOneHorario(+id);
  }

  @Patch('horario/:id')
  updateHorario(@Param('id') id: string, @Body() updateHorarioDto: CreateHorarioDto) {
    return this.horarioService.updateHorario(+id, updateHorarioDto);
  }

  @Delete('horario/:id')
  removeHorario(@Param('id') id: string) {
    return this.horarioService.removeHorario(+id);
  }

  //Matriculas 
  @Get('usuario/:id_usuario/matriculas') 
  async getMatriculasByUsuario(
    @Param('id_usuario', ParseIntPipe) idUsuario: number,
  ): Promise<MatriculaEntity[]> {
    const matriculas = await this.matriculaService.getMatriculasByUsuario(idUsuario);
    return matriculas;
  }
  @Get('/:id/materias')
  async getMateriasByMatricula(@Param('id') id: number): Promise<MateriaEntity[]> {
    try {
      const matricula = await this.matriculaService.getMateriasByMatricula(id);    

      return matricula; // Return the list of HorarioEntity objects
    } catch (error) {
      // Handle errors appropriately, providing informative messages to the client
      throw error; // Re-throw the error for proper handling in upper layers
    }
  }

  @Get('/:id/horarios')
  async getHorariosByMatricula(@Param('id') id: number): Promise<HorarioEntity[]> {
    try {
      const matricula = await this.matriculaService.getHorariosByMatricula(id);    

      return matricula; // Return the list of HorarioEntity objects
    } catch (error) {
      // Handle errors appropriately, providing informative messages to the client
      throw error; // Re-throw the error for proper handling in upper layers
    }
  }


  @Post()
  create(@Body() createMatriculaDto: CreateMatriculaDto) {
    return this.matriculaService.create(createMatriculaDto);
  }

  @Get()
  findAll() {
    return this.matriculaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matriculaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatriculaDto: UpdateMatriculaDto) {
    return this.matriculaService.update(+id, updateMatriculaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matriculaService.remove(+id);
  }
}
