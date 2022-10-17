import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { UserSchemaType } from '../types/users.types';
import { QueryParamsType } from '../../../types/global-types';
import { paginator } from '../../../utils/paginator.helper';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async registerUser(newUser): Promise<mongoose.Types.ObjectId> {
    const userId = await this.userModel.create(newUser);
    return userId._id;
  }

  async deleteUser(id: mongoose.Types.ObjectId): Promise<boolean> {
    const res = await this.userModel.deleteOne({ _id: id });
    return res.acknowledged;
  }

  async findByLogin(login: string): Promise<UserSchemaType | null> {
    return this.userModel.findOne({ 'accountData.login': login });
  }

  async findByEmail(email: string): Promise<UserSchemaType | null> {
    return this.userModel.findOne({ 'accountData.email': email });
  }

  async findById(id: mongoose.Types.ObjectId): Promise<UserSchemaType | null> {
    return this.userModel.findOne({ _id: id });
  }

  async findByLoginOrEmail(login?: string, email?: string) {
    return this.userModel.findOne({
      $or: [{ 'accountData.login': login }, { 'accountData.email': email }],
    });
  }
  async findByConfirmCode(code: string): Promise<UserSchemaType | null> {
    return this.userModel.findOne({ 'emailConfirmation.confirmationCode': code }).lean();
  }

  async updateConfirm(id: mongoose.Types.ObjectId): Promise<boolean> {
    const res = await this.userModel.updateOne(
      { _id: id },
      { 'emailConfirmation.isConfirmed': true },
    );
    return res.acknowledged;
  }
  async updateCode(id: mongoose.Types.ObjectId, code: string): Promise<boolean> {
    const res = await this.userModel.updateOne(
      { id },
      { $set: { 'emailConfirmation.confirmationCode': code } },
    );
    return res.acknowledged;
  }
}
