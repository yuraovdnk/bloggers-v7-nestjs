import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Comment } from '../schemas/comment.schema';

import { PaginatedItems, QueryParamsType } from '../../../types/global-types';
import { CommentMapper } from './query-service/comment.mapper';
import { paginator } from '../../../utils/paginator.helper';
import { AggregatedCommentType, CommentViewType } from '../types/comments.types';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async getCommentById(
    commentId: mongoose.Types.ObjectId,
    userId?: mongoose.Types.ObjectId,
  ): Promise<CommentViewType> {
    const comments = await this.commentModel.aggregate([
      { $match: { _id: commentId } },
      { $addFields: { _id: '$_id' } },
      {
        $lookup: {
          localField: '_id',
          from: 'likes',
          foreignField: 'parentId',
          as: 'likesInfo.likes',
        },
      },
      {
        $addFields: {
          'likesInfo.countLikes': {
            $size: {
              $filter: {
                input: '$likesInfo.likes',
                cond: { $eq: ['$$this.likeStatus', 'Like'] },
              },
            },
          },
          'likesInfo.countDislikes': {
            $size: {
              $filter: {
                input: '$likesInfo.likes',
                cond: { $eq: ['$$this.likeStatus', 'Dislike'] },
              },
            },
          },
        },
      },
    ]);
    return CommentMapper.mapComment(comments[0], userId);
  }

  async getCommentsByPostId(
    postId: mongoose.Types.ObjectId,
    queryParams: QueryParamsType,
    userId?: mongoose.Types.ObjectId,
  ): Promise<PaginatedItems<CommentViewType>> {
    const comments = await this.commentModel.aggregate([
      { $match: { postId } },
      { $addFields: { _id: '$_id' } },
      {
        $lookup: {
          localField: '_id',
          from: 'likes',
          foreignField: 'parentId',
          as: 'likesInfo.likes',
        },
      },
      {
        $addFields: {
          'likesInfo.countLikes': {
            $size: {
              $filter: {
                input: '$likesInfo.likes',
                cond: { $eq: ['$$this.likeStatus', 'Like'] },
              },
            },
          },
          'likesInfo.countDislikes': {
            $size: {
              $filter: {
                input: '$likesInfo.likes',
                cond: { $eq: ['$$this.likeStatus', 'Dislike'] },
              },
            },
          },
        },
      },
      { $skip: queryParams.skip },
      { $limit: queryParams.pageSize },
    ]);
    const paginatedItems = paginator<AggregatedCommentType>(comments, queryParams);
    return CommentMapper.mapPaginatedComments(paginatedItems, userId);
  }
}
