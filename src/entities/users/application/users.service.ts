import { UsersRepository } from '../infrastructure/users.repository';
import { QueryParamsType } from '../../../types/global-types';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegistrationDto } from '../../auth/dto/registration.dto';
import { add } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import mongoose from 'mongoose';
import { mapErrors } from '../../../exceptions/mapErrors';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

  async addUser(createUserDto: RegistrationDto): Promise<mongoose.Types.ObjectId> {
    const existUser = await this.usersRepository.findByLoginOrEmail(
      createUserDto.login,
      createUserDto.email,
    );
    if (existUser) {
      throw new BadRequestException(mapErrors('user is exist', 'login or email'));
    }
    const passwordHash = await this.generateHash(createUserDto.password);
    const newUser = {
      accountData: {
        login: createUserDto.login,
        email: createUserDto.email,
        passwordHash,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuid(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: true,
      },
    };
    return await this.usersRepository.registerUser(newUser);
  }

  async deleteUser(id: mongoose.Types.ObjectId) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException();
    return this.usersRepository.deleteUser(id);
  }
  async generateHash(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
