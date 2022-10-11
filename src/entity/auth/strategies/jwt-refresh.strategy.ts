import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersRepository } from '../../users/users.repository';
import { constans } from '../../../constans';
import { TokenService } from '../token.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(protected usersRepository: UsersRepository, protected tokenService: TokenService) {
    super({
      jwtFromRequest: (req) => {
        return req.cookies.refreshToken;
      },
      ignoreExpiration: false,
      secretOrKey: constans.secretRefreshToken,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<any> {
    const token = req.cookies.refreshToken;
    const existToken = await this.tokenService.getToken(token);
    if (!existToken) throw new UnauthorizedException();
    const user = await this.usersRepository.findById(payload.userId);
    return user;
  }
}
