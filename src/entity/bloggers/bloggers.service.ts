import { BloggersRepository } from './infrastructure/bloggers.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import mongoose from 'mongoose';
import { QueryParamsType } from '../../types/global-types';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { CreatePostSpecBloggerDto } from './dto/create-post-spec-blogger.dto';
import { mapErrors } from '../../exceptions/mapErrors';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { Blogger } from './schemas/blogger.schema';
import { Post } from '../posts/schemas/post.schema';

const validateOrRejectModel = async (model: any, ctor: { new (): any }) => {
  if (model instanceof ctor === false) {
    throw new Error('incorrect input dara');
  }
  try {
    await validateOrReject(model);
  } catch (error) {
    throw new Error(error);
  }
};
//await validateOrRejectModel(inputModel, createBlogger);

@Injectable()
export class BloggersService {
  constructor(private bloggersRepository: BloggersRepository, private postsRepository: PostsRepository) {}

  async createBlogger(createBloggerDto: CreateBloggerDto): Promise<Blogger> {
    const newBlogger = {
      name: createBloggerDto.name,
      youtubeUrl: createBloggerDto.youtubeUrl,
    };
    return this.bloggersRepository.createBlogger(newBlogger);
  }

  async updateBlogger(bloggerId: mongoose.Types.ObjectId, updateBloggerDto: CreateBloggerDto): Promise<boolean> {
    const blogger = await this.bloggersRepository.getBloggerById(bloggerId);
    if (!blogger) throw new NotFoundException();

    return this.bloggersRepository.updateBlogger(bloggerId, updateBloggerDto);
  }

  async deleteBlogger(bloggerId: mongoose.Types.ObjectId): Promise<boolean> {
    const existBlogger = await this.bloggersRepository.getBloggerById(bloggerId);
    if (!existBlogger) throw new NotFoundException();

    return this.bloggersRepository.deleteBlogger(bloggerId);
  }
  async createPostForBlogger(
    createPostDto: CreatePostSpecBloggerDto,
    bloggerId: mongoose.Types.ObjectId,
  ): Promise<mongoose.Types.ObjectId> {
    const blogger = await this.bloggersRepository.getBloggerById(bloggerId);
    if (!blogger) throw new NotFoundException();

    const newPost = {
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      bloggerId,
    };
    return await this.postsRepository.createPost(newPost);
  }
}
