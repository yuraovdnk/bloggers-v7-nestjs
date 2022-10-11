import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import mongoose from 'mongoose';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { Response } from 'express';
import { JwtRevokedAuthGuard } from './guards/jwt-revoked.guard';
import { Cookies } from './decorators/cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() registrationDto: RegistrationDto) {
    await this.authService.signUp(registrationDto);
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirm(@Body('code') confirmCode: string) {
    await this.authService.confirmEmail(confirmCode);
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async emailResending(@Body('email') email: string) {
    await this.authService.resendEmail(email);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async login(@Res() res: Response, @CurrentUser() userId: mongoose.Types.ObjectId) {
    const tokens = await this.authService.generateTokens(userId);
    res.cookie('refreshToken', tokens.refreshToken);
    res.status(200).send({ accessToken: tokens.accessToken });
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(200)
  async refreshToken(@Res() res: Response, @CurrentUser() userId: mongoose.Types.ObjectId) {
    const tokens = await this.authService.generateTokens(userId);
    res.cookie('refreshToken', tokens.refreshToken);
    res.status(200).send({ accessToken: tokens.accessToken });
  }

  @Post('logout')
  @UseGuards(JwtRevokedAuthGuard)
  @HttpCode(204)
  async logout(@Cookies('refreshToken') refreshToken: string) {
    await this.authService.signOut(refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async infoAboutMe(@CurrentUser() userId: mongoose.Types.ObjectId) {
    return await this.authService.infoAboutMe(userId);
  }
}
