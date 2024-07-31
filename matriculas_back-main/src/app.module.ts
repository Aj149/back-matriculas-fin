import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { RolModule } from './rol/rol.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from './config/constants';
import { MatriculaModule } from './matricula/matricula.module';
import { InformeModule } from './informe/informe.module';


@Module({
  imports:[
  ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,      
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get<string>(DB_HOST),
      port: +configService.get<number>(DB_PORT),
      username: configService.get<string>(DB_USER),
      password: configService.get<string>(DB_PASSWORD),
      database: configService.get<string>(DB_DATABASE),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
    inject: [ConfigService],
  }),  
  EstudianteModule,
  UsuarioModule,
  AuthModule,
  RolModule,
  MatriculaModule,
  InformeModule,  
],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
