import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { QueryParamsType } from '../../../types/global-types';
import { paginator } from '../../../utils/paginator.helper';
import { UsersMapper } from './query-service/users.mapper';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getUsers(queryParams: QueryParamsType) {
    const filter = queryParams.searchNameTerm;
    const items = await this.userModel
      .find({ filter })
      .skip(queryParams.skip)
      .limit(queryParams.pageSize);
    const users = paginator<User>(items, queryParams);
    return UsersMapper.mapPaginatedUsers(users);
  }
  async getUserById(userId: mongoose.Types.ObjectId) {
    const user = await this.userModel.findOne({ _id: userId });
    return UsersMapper.mapUser(user);
  }
}
