import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolEntity } from 'src/rol/entities/rol.entity';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { HorarioEntity } from 'src/matricula/entities/horario.entity';
import { EstudianteEntity } from 'src/estudiante/entities/estudiante.entity';
import { MateriaEntity } from 'src/matricula/entities/materia.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity, RolEntity, HorarioEntity, EstudianteEntity, MateriaEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(JWT_SECRET),
        signOptions: {
          expiresIn: 7200, // 2 horas
        },
      }),
      inject: [ConfigService],
    }), 
  ],
  providers: [AuthService, ConfigService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
