import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { Blogger } from '../bloggers/schemas/blogger.schema';
import { Post } from '../posts/schemas/post.schema';
import { Token } from '../auth/schemas/token.schema';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Blogger.name) private bloggerModel: Model<Blogger>,
    @InjectModel(Post.name) private postsModel: Model<Post>, //TODO insert comment model
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}
  @Delete('/all-data')
  @HttpCode(204)
  async deleteDbData() {
    try {
      await this.tokenModel.deleteMany({});
      await this.userModel.deleteMany({});
      await this.bloggerModel.deleteMany({});
      await this.postsModel.deleteMany({});
    } catch (e) {
      console.log(e);
    }
  }
}
