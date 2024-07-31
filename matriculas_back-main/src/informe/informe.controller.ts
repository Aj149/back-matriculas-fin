import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InformeService } from './informe.service';
import { CreateInformeDto } from './dto/create-informe.dto';
import { UpdateInformeDto } from './dto/update-informe.dto';
import { InformeEntity } from './entities/informe.entity';
import { RolDecorator } from 'src/decorators/rol.decorator';
import { RolNombre } from 'src/rol/rol.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/rol.guard';

@Controller('informe')
export class InformeController {
  constructor(private readonly informeService: InformeService) {}

  @RolDecorator(RolNombre.ADMIN, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createInforme(@Body() createInformeDto: CreateInformeDto) {
    return this.informeService.createInforme(createInformeDto);
  }

  @RolDecorator(RolNombre.ADMIN, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(): Promise<InformeEntity[]> {
    return this.informeService.findAllInforme();
  }


  @RolDecorator(RolNombre.ADMIN, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('instructor/:id/informes')
  async getInformesByInstructor(
    @Param('id') instructorId: number,
  ): Promise<InformeEntity[]> {
    return await this.informeService.findInformeByInstructor(instructorId);
  }

  @RolDecorator(RolNombre.ADMIN, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id_informe')
  findOne(@Param('id_informe') id_informe: number): Promise<InformeEntity> {
    return this.informeService.findOneInforme(id_informe);
  }

  @RolDecorator(RolNombre.ADMIN, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id_informe')
  update(
    @Param('id_informe') id_informe: number,
    @Body() updateInformeDto: UpdateInformeDto,
  ) {
    return this.informeService.updateInforme(id_informe, updateInformeDto);
  }

  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id_informe')
  remove(@Param('id_informe') id_informe: number) {
    return this.informeService.removeInforme(id_informe);
  }
}
