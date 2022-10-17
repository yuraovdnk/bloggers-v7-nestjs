import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { QueryParamsPipe } from '../../pipes/query-params.pipe';
import { QueryParamsType } from '../../types/global-types';
import { RegistrationDto } from '../auth/dto/registration.dto';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { ParseObjectIdPipe } from '../../pipes/objectId.pipe';
import mongoose from 'mongoose';
import { UsersQueryRepository } from './infrastructure/users.query.repository';

@Controller('users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    private userQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  async getUsers(@Query(QueryParamsPipe) queryParams: QueryParamsType) {
    return this.userQueryRepository.getUsers(queryParams);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async addUser(@Body() createUserDto: RegistrationDto) {
    const createdUserId = await this.usersService.addUser(createUserDto);
    return this.userQueryRepository.getUserById(createdUserId);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    await this.usersService.deleteUser(id);
  }
}
