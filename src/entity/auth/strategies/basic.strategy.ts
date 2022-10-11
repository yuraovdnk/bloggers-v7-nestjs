import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { constans } from '../../../constans';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password) => {
    if (constans.username === username && constans.password === password) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
