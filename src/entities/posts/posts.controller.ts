import { PostsService } from './application/posts.service';
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
import { CreatePostDto } from './dto/create-post.dto';
import { ParseObjectIdPipe } from '../../pipes/objectId.pipe';
import mongoose from 'mongoose';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { PaginatedItems, QueryParamsType } from '../../types/global-types';
import { QueryParamsPipe } from '../../pipes/query-params.pipe';
import { PostsQueryRepository } from './infrastructure/posts.query.repository';
import { CommentsService } from '../comments/application/comments.service';
import { CommentsQueryRepository } from '../comments/instrasctucture/query-comments.repostitory';
import { CommandBus } from '@nestjs/cqrs';
import { LikePostCommand } from './application/use-cases/like-post.command';
import { SkipThrottle } from '@nestjs/throttler';
import { ParseStatusLikeEnumPipe } from '../../pipes/status-like-enum.pipe';
import { PostViewType } from './types/posts.types';
import { CommentViewType } from '../comments/types/comments.types';
import { JwtExtractGuard } from '../auth/guards/jwt-extract.guard';

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
  async createPost(@Body() createPost: CreatePostDto): Promise<PostViewType> {
    const createdPostId = await this.postsService.createPost(createPost);
    return this.postsQueryRepository.getPostById(createdPostId);
  }

  @Get()
  @UseGuards(JwtExtractGuard)
  async getPosts(
    @Query(QueryParamsPipe) queryParams: QueryParamsType,
    @CurrentUser() userId: mongoose.Types.ObjectId,
  ) {
    return await this.postsQueryRepository.getPosts(queryParams, userId);
  }

  @Get(':postId')
  @UseGuards(JwtExtractGuard)
  async getPostById(
    @Param('postId', ParseObjectIdPipe) postId: mongoose.Types.ObjectId,
    @CurrentUser() userId: mongoose.Types.ObjectId,
  ): Promise<PostViewType> {
    const post = await this.postsQueryRepository.getPostById(postId, userId);
    if (!post) throw new NotFoundException();
    return post;
  }

  @Put(':postId')
  @HttpCode(204)
  async updatePost(
    @Param('postId', ParseObjectIdPipe) postId: mongoose.Types.ObjectId,
    @Body() updatePostDto: CreatePostDto,
  ): Promise<boolean> {
    return this.postsService.updatePost(postId, updatePostDto);
  }

  @Delete(':postId')
  @HttpCode(204)
  async deletePost(
    @Param('postId', ParseObjectIdPipe) postId: mongoose.Types.ObjectId,
  ): Promise<boolean> {
    return this.postsService.deletePost(postId);
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

  @UseGuards(JwtExtractGuard)
  @Get(':postId/comments')
  async getCommentsForPost(
    @Param('postId', ParseObjectIdPipe) postId: mongoose.Types.ObjectId,
    @Query(QueryParamsPipe) queryParams: QueryParamsType,
    @CurrentUser() userId: mongoose.Types.ObjectId,
  ): Promise<PaginatedItems<CommentViewType>> {
    return this.commentsQueryRepository.getCommentsByPostId(postId, queryParams, userId);
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
