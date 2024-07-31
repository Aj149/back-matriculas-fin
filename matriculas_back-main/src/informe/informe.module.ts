import { Module } from '@nestjs/common';
import { InformeService } from './informe.service';
import { InformeController } from './informe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformeEntity } from './entities/informe.entity';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([InformeEntity, UsuarioEntity])],
  controllers: [InformeController],
  providers: [InformeService],
})
export class InformeModule {}
