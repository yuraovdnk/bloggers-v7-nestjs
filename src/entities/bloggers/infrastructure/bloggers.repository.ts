import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogger } from '../schemas/blogger.schema';
import mongoose, { Model } from 'mongoose';
import { CreateBloggerDto } from '../dto/create-blogger.dto';
import { BloggerSchemaType } from '../types/blogger-types';

@Injectable()
export class BloggersRepository {
  constructor(@InjectModel(Blogger.name) private bloggerModel: Model<Blogger>) {}

  async createBlogger(createBloggerDto: CreateBloggerDto): Promise<mongoose.Types.ObjectId> {
    const newBloggerId = await this.bloggerModel.create(createBloggerDto);
    return newBloggerId._id;
  }

  async getBloggerById(id: mongoose.Types.ObjectId): Promise<BloggerSchemaType> {
    return this.bloggerModel.findOne({ _id: id });
  }

  async updateBlogger(
    id: mongoose.Types.ObjectId,
    updateBloggerDto: CreateBloggerDto,
  ): Promise<boolean> {
    const query = await this.bloggerModel.updateOne(
      { _id: id },
      { name: updateBloggerDto.name, youtubeUrl: updateBloggerDto.youtubeUrl },
    );
    return query.acknowledged;
  }

  async deleteBlogger(id: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await this.bloggerModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
