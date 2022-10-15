import { PostsService } from './application/posts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { ParseObjectIdPipe } from '../../pipes/objectId.pipe';
import mongoose from 'mongoose';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { QueryParamsType } from '../../types/global-types';
import { QueryParamsPipe } from '../../pipes/query-params.pipe';
import { PostsQueryRepository } from './infrastructure/posts.query.repository';
import { CommentsService } from '../comments/application/comments.service';
import { CommentsQueryRepository } from '../comments/instrasctucture/query-comments.repostitory';
import { CommandBus } from '@nestjs/cqrs';
import { LikePostCommand } from './application/use-cases/like-post.command';
import { SkipThrottle } from '@nestjs/throttler';
import { ParseStatusLikeEnumPipe } from '../../pipes/status-like-enum.pipe';

@SkipThrottle()
@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Post()
  @HttpCode(201)
  async createPost(@Body() createPost: CreatePostDto) {
    const createdPostId = await this.postsService.createPost(createPost);
    return this.postsQueryRepository.getPostById(createdPostId);
  }

  @Get()
  async getPosts(@Query(QueryParamsPipe) queryParams: QueryParamsType) {
    return await this.postsQueryRepository.getPosts(queryParams);
  }

  @Get(':postId')
  async getPostById(@Param('postId', ParseObjectIdPipe) postId: mongoose.Types.ObjectId) {
    const post = await this.postsQueryRepository.getPostById(postId);
    if (!post) throw new NotFoundException();
    return post;
  }

  @Put(':postId')
  @HttpCode(204)
  async updatePost(
    @Param('postId', ParseObjectIdPipe) postId: mongoose.Types.ObjectId,
    @Body() updatePostDto: CreatePostDto,
  ) {
    await this.postsService.updatePost(postId, updatePostDto);
  }

  @Delete(':postId')
  @HttpCode(204)
  async deletePost(@Param('postId', ParseObjectIdPipe) postId: mongoose.Types.ObjectId) {
    await this.postsService.deletePost(postId);
  }

  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  async createCommentsForPost(
    @Param('postId', ParseObjectIdPipe) postId: mongoose.Types.ObjectId,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() userId: mongoose.Types.ObjectId,
  ) {
    const newCommentId = await this.commentsService.createCommentForPost(
      postId,
      createCommentDto,
      userId,
    );
    return this.commentsQueryRepository.getCommentById(newCommentId, userId);
  }

  @Get(':postId/comments')
  async getCommentsForPost(
    @Param('postId', ParseObjectIdPipe) postId: mongoose.Types.ObjectId,
    @Query(QueryParamsPipe) queryParams: QueryParamsType,
  ) {
    return await this.commentsQueryRepository.getCommentsByPostId(postId, queryParams);
  }

  @Put(':postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async setLikeStatus(
    @Param('postId', ParseObjectIdPipe) postId: mongoose.Types.ObjectId,
    @CurrentUser() userId: mongoose.Types.ObjectId,
    @Body('likeStatus', ParseStatusLikeEnumPipe) likeStatus: string,
  ) {
    return this.commandBus.execute(new LikePostCommand(userId, postId, likeStatus));
  }
}
