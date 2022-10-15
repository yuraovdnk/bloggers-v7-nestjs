import { CommentsRepository } from '../instrasctucture/comments.repository';
import mongoose from 'mongoose';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { statusesLike } from '../../bloggers/types/blogger-enums';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected usersRepository: UsersRepository,
    private postRepository: PostsRepository,
  ) {}

  async createCommentForPost(
    postId: mongoose.Types.ObjectId,
    createCommentDto: CreateCommentDto,
    userId: mongoose.Types.ObjectId,
  ) {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    const user = await this.usersRepository.findById(userId);
    const newComment = {
      content: createCommentDto.content,
      postId,
      userId,
      userLogin: user.accountData.login,
      addedAt: new Date(),
    };
    return this.commentsRepository.createComment(newComment);
  }

  async updateComment(
    userId: mongoose.Types.ObjectId,
    commentId: mongoose.Types.ObjectId,
    content: string,
  ) {
    const comment = await this.commentsRepository.getCommentById(commentId);
    if (!comment) throw new NotFoundException();
    if (comment.userId.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
    return this.commentsRepository.updateComment(commentId, content);
  }

  async deleteComment(userId: mongoose.Types.ObjectId, commentId: mongoose.Types.ObjectId) {
    const comment = await this.commentsRepository.getCommentById(commentId);
    if (!comment) throw new NotFoundException();
    if (comment.userId.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
    return this.commentsRepository.deleteComment(commentId);
  }

  async setLikeStatus(
    commentId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    likeStatus: string,
  ) {
    if (likeStatus === statusesLike.None) {
      return await this.commentsRepository.unsetLike(commentId, userId);
    }

    const result = await this.commentsRepository.setLikeStatus(commentId, userId, likeStatus);
    if (!result) {
      await this.commentsRepository.setNewLike(commentId, userId, likeStatus);
    }
    return true;
  }
}
