import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas/token.schema';
import mongoose, { Model } from 'mongoose';
@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) protected tokenModel: Model<Token>) {}

  async deleteToken(refreshToken: string) {
    const res = await this.tokenModel.deleteOne({ refreshToken });
    return res.deletedCount === 1;
  }

  async saveToken(userId: mongoose.Types.ObjectId, refreshToken: string) {
    const token = await this.tokenModel.findOne({ userId });
    if (token) {
      token.refreshToken = refreshToken;
      return await token.save();
    }
    return await this.tokenModel.create({ userId, refreshToken });
  }

  async getToken(refreshToken: string): Promise<Token> {
    return this.tokenModel.findOne({ refreshToken });
  }
}
