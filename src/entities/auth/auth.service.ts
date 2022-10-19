import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { EmailManager } from '../../infrastucture/notification/email.manager';
import { LoginDto } from './dto/login.dto';
import { mapErrors } from '../../exceptions/mapErrors';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected emailManager: EmailManager,
    protected jwtService: JwtService,
    protected tokenService: TokenService,
    private configService: ConfigService,
  ) {}

  async signUp(registrationDto: RegistrationDto) {
    const existUser = await this.usersRepository.findByLoginOrEmail(
      registrationDto.login,
      registrationDto.email,
    );
    if (existUser) {
      throw new BadRequestException(mapErrors('user is exist', 'login or email'));
    }
    const passwordHash = await this.generateHash(registrationDto.password);
    const newUser = {
      accountData: {
        login: registrationDto.login,
        email: registrationDto.email,
        passwordHash,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuid(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
    };
    const createdUserId = await this.usersRepository.registerUser(newUser);
    const user = await this.usersRepository.findById(createdUserId);
    try {
      await this.emailManager.sendConfirmMail(user);
    } catch (e) {
      await this.usersRepository.deleteUser(createdUserId);
      throw new InternalServerErrorException();
    }
    return true;
  }

  async checkCredentials(loginDto: LoginDto) {
    const candidate = await this.usersRepository.findByLogin(loginDto.login);
    if (!candidate) {
      throw new NotFoundException();
    }
    if (!candidate.emailConfirmation.isConfirmed) {
      throw new BadRequestException(mapErrors('Account is not confirmed', 'confirm'));
    }
    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      candidate.accountData.passwordHash,
    );
    if (!isValidPassword) {
      throw new BadRequestException(mapErrors('login or password is not correct', 'auth'));
    }
    return candidate;
  }

  async generateTokens(userId: mongoose.Types.ObjectId) {
    const payload = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('secrets.secretAccessToken'),
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('secrets.secretRefreshToken'),
      expiresIn: '2d',
    });
    await this.tokenService.saveToken(userId, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  async confirmEmail(confirmCode: string) {
    const user = await this.usersRepository.findByConfirmCode(confirmCode);
    if (
      !user ||
      user.emailConfirmation.isConfirmed ||
      user.emailConfirmation.confirmationCode !== confirmCode ||
      user.emailConfirmation.expirationDate < new Date()
    ) {
      throw new BadRequestException(mapErrors('someging wrong with confirmCode', 'confirm code'));
    }
    return await this.usersRepository.updateConfirm(user._id);
  }

  async resendEmail(email: string): Promise<boolean> {
    const user = await this.usersRepository.findByEmail(email);

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException(mapErrors('invalid email', 'email'));
    }
    const newConfirmCode = uuid();
    await this.usersRepository.updateCode(user._id, newConfirmCode);
    const userWithUpdated = await this.usersRepository.findByConfirmCode(newConfirmCode);
    try {
      await this.emailManager.sendConfirmMail(userWithUpdated);
      return true;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async generateHash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async infoAboutMe(userId: mongoose.Types.ObjectId) {
    const user = await this.usersRepository.findById(userId);
    return {
      email: user.accountData.email,
      login: user.accountData.login,
      userId: user._id,
    };
  }

  async signOut(refreshToken: string) {
    return this.tokenService.deleteToken(refreshToken);
  }
}
