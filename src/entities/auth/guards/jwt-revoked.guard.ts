import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRevokedAuthGuard extends AuthGuard('jwt-revoked') {}
