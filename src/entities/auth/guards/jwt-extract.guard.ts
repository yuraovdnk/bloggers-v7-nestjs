import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';

@Injectable()
export class JwtExtractGuard implements CanActivate {
  constructor(
    private usersRepo: UsersRepository,
    private jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      request.user = 'None';
      return true;
    }
    const token: string = request.headers.authorization.split(' ')[1];
    let userId = null;
    try {
      const result = this.jwtService.verify(token, {
        secret: this.configService.get('secrets.secretAccessToken'),
      });
      userId = new mongoose.Types.ObjectId(result.userId);
    } catch (e) {
      throw new UnauthorizedException();
    }

    const user = await this.usersRepo.findById(userId);
    request.user = user;
    return true;
  }
}
