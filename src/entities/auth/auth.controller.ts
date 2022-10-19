import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import mongoose from 'mongoose';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { Response } from 'express';
import { JwtRevokedAuthGuard } from './guards/jwt-revoked.guard';
import { Cookies } from '../../decorators/cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() registrationDto: RegistrationDto) {
    return this.authService.signUp(registrationDto);
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirm(@Body('code') confirmCode: string) {
    return this.authService.confirmEmail(confirmCode);
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async emailResending(@Body('email') email: string) {
    return this.authService.resendEmail(email);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Res() res: Response, @CurrentUser() userId: mongoose.Types.ObjectId) {
    const tokens = await this.authService.generateTokens(userId);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
    res.status(200).send({ accessToken: tokens.accessToken });
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Res() res: Response, @CurrentUser() userId: mongoose.Types.ObjectId) {
    const tokens = await this.authService.generateTokens(userId);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
    res.status(200).send({ accessToken: tokens.accessToken });
  }

  @UseGuards(JwtRevokedAuthGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(@Res() res: Response, @Cookies('refreshToken') refreshToken: string) {
    const result = await this.authService.signOut(refreshToken);
    if (result) {
      res.clearCookie('refreshToken');
      return res.sendStatus(204);
    }
    res.sendStatus(401);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async infoAboutMe(@CurrentUser() userId: mongoose.Types.ObjectId) {
    return await this.authService.infoAboutMe(userId);
  }
}
