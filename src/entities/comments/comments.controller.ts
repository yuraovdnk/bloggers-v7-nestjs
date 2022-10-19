import { CommentsService } from './application/comments.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../../pipes/objectId.pipe';
import mongoose from 'mongoose';
import { CommentsQueryRepository } from './instrasctucture/query-comments.repostitory';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommandBus } from '@nestjs/cqrs';
import { LikeCommentCommand } from './application/use-cases/like-comment.command';
import { JwtExtractGuard } from '../auth/guards/jwt-extract.guard';
import { CommentViewType } from './types/comments.types';
import { ParseStatusLikeEnumPipe } from '../../pipes/status-like-enum.pipe';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get(':commentId')
  @UseGuards(JwtExtractGuard)
  async getCommentById(
    @Param('commentId', ParseObjectIdPipe) commentId: mongoose.Types.ObjectId,
    @CurrentUser() userId: mongoose.Types.ObjectId,
  ): Promise<CommentViewType> {
    const comment = await this.commentsQueryRepository.getCommentById(commentId, userId);
    if (!comment) throw new NotFoundException();
    return comment;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  @HttpCode(204)
  async updateComment(
    @Param('commentId', ParseObjectIdPipe) commentId: mongoose.Types.ObjectId,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() userId: mongoose.Types.ObjectId,
  ): Promise<boolean> {
    return this.commentsService.updateComment(userId, commentId, updateCommentDto.content);
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteComment(
    @Param('commentId', ParseObjectIdPipe) commentId: mongoose.Types.ObjectId,
    @CurrentUser() userId: mongoose.Types.ObjectId,
  ): Promise<boolean> {
    return this.commentsService.deleteComment(userId, commentId);
  }

  @Put(':commentId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async setLikeStatus(
    @Param('commentId', ParseObjectIdPipe) commentId: mongoose.Types.ObjectId,
    @CurrentUser() userId: mongoose.Types.ObjectId,
    @Body('likeStatus', ParseStatusLikeEnumPipe) likeStatus: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new LikeCommentCommand(userId, commentId, likeStatus));
  }
}
