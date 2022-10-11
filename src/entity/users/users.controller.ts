import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryParamsPipe } from '../../pipes/query-params.pipe';
import { QueryParamsType } from '../../types/global-types';
import { RegistrationDto } from '../auth/dto/registration.dto';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { ParseObjectIdPipe } from '../../pipes/objectId.pipe';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @Get()
  async getUsers(@Query(QueryParamsPipe) queryParams: QueryParamsType) {
    return await this.usersService.getUsers(queryParams);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async addUser(@Body() createUserDto: RegistrationDto) {
    await this.usersService.addUser(createUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    await this.usersService.deleteUser(id);
  }
}
