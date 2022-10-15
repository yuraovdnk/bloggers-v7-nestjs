import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { TokenService } from '../token.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRevokedStrategy extends PassportStrategy(Strategy, 'jwt-revoked') {
  constructor(
    protected usersRepository: UsersRepository,
    protected tokenService: TokenService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req) => {
        return req.cookies.refreshToken;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('secrets.secretRefreshToken'),
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
