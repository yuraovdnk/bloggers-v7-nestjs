import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../../pipes/objectId.pipe';
import { QueryParamsPipe } from '../../pipes/query-params.pipe';
import { QueryParamsType } from '../../types/global-types';
import { BloggersQueryRepository } from './infrastructure/bloggers.query.repository';
import { CreatePostSpecBloggerDto } from './dto/create-post-spec-blogger.dto';
import { PostsQueryRepository } from '../posts/infrastructure/posts.query.repository';
import { BloggerViewType } from './types/blogger-types';
import { SkipThrottle } from '@nestjs/throttler';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { JwtExtractGuard } from '../auth/guards/jwt-extract.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';

@SkipThrottle()
@Controller('bloggers')
export class BloggersController {
  constructor(
    private bloggersService: BloggersService,
    private bloggersQueryRepository: BloggersQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getBloggers(@Query(QueryParamsPipe) queryParams: QueryParamsType) {
    return await this.bloggersQueryRepository.getBloggers(queryParams);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlogger(@Body() createBloggerDto: CreateBloggerDto): Promise<BloggerViewType> {
    const bloggerId = await this.bloggersService.createBlogger(createBloggerDto);
    return this.bloggersQueryRepository.getBloggerById(bloggerId);
  }

  @Get(':id')
  async getBloggerById(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    const blogger = await this.bloggersQueryRepository.getBloggerById(id);
    if (!blogger) throw new NotFoundException();
    return blogger;
  }

  @UseGuards(BasicAuthGuard)
  @Put(':bloggerId')
  @HttpCode(204)
  async updateBlogger(
    @Param('bloggerId', ParseObjectIdPipe) bloggerId: mongoose.Types.ObjectId,
    @Body() updateBloggerDto: CreateBloggerDto,
  ) {
    return await this.bloggersService.updateBlogger(bloggerId, updateBloggerDto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogger(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    return await this.bloggersService.deleteBlogger(id);
  }

  @Post(':bloggerId/posts')
  async createPostForSpecificBlogger(
    @Param('bloggerId', ParseObjectIdPipe) bloggerId: mongoose.Types.ObjectId,
    @Body() createPostDto: CreatePostSpecBloggerDto,
  ) {
    const newPostId = await this.bloggersService.createPostForBlogger(createPostDto, bloggerId);
    return this.postsQueryRepository.getPostById(newPostId);
  }

  @Get(':bloggerId/posts')
  @UseGuards(JwtExtractGuard)
  async getPostsByBloggerId(
    @Param('bloggerId', ParseObjectIdPipe) bloggerId: mongoose.Types.ObjectId,
    @Query(QueryParamsPipe) queryParams: QueryParamsType,
    @CurrentUser() userId: mongoose.Types.ObjectId,
  ) {
    //TODO optimize query for get Blogger
    const blogger = await this.bloggersQueryRepository.getBloggerById(bloggerId);
    if (!blogger) throw new NotFoundException();
    return this.postsQueryRepository.getPostsByBloggerId(bloggerId, queryParams, userId);
  }
}
