import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';

const myUserName = 'admin';
const myPassword = 'qwerty';
@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization || '';
    const typeAuth = header.split(/\s+/).shift();
    if (typeAuth !== 'Basic') {
      throw new UnauthorizedException();
    }
    const token = header.split(/\s+/).pop() || '';
    const auth = Buffer.from(token, 'base64').toString().split(/:/);
    const username = auth.shift();
    const password = auth.pop();
    if (myUserName !== username || myPassword !== password) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
