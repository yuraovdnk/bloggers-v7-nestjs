import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password) => {
    const isValidUserName = this.configService.get('admin.userName') === username;
    const isVaidUserPassword = this.configService.get('admin.password') === password;
    if (isValidUserName && isVaidUserPassword) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
