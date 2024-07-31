import { PayloadInterface } from './../payload.interface';
import { MessageDto } from './../../common/message.dto';
import { JWT_SECRET } from './../../config/constants';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly authRepository: Repository<UsuarioEntity>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  async validate(payload: PayloadInterface) {
    const {  nombres_usuario, cedula } = payload;
    const usuario = await this.authRepository.findOne({
      where: [{  nombres_usuario:  nombres_usuario }, { cedula: cedula }],
    });
    if (!usuario)
      return new UnauthorizedException(new MessageDto('credenciales erróneas'));
    return payload;
  }
}
