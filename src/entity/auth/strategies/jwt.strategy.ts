import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../users/users.repository';
import { constans } from '../../../constans';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(protected usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constans.secretAccessToken,
    });
  }

  async validate(payload: any): Promise<any> {
    const user = await this.usersRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
