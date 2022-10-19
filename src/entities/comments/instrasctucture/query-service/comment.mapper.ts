import { AggregatedCommentType, CommentViewType } from '../../types/comments.types';
import mongoose from 'mongoose';
import { PaginatedItems } from '../../../../types/global-types';
import { CommentLikesService } from './comment-likes.service';

export class CommentMapper {
  static mapPaginatedComments(
    paginatedComments: PaginatedItems<AggregatedCommentType>,
    userId: mongoose.Types.ObjectId,
  ): PaginatedItems<CommentViewType> {
    const items = paginatedComments.items.map((item) => this.mapComment(item, userId));
    return {
      ...paginatedComments,
      items,
    };
  }
  static mapComment(
    comment: AggregatedCommentType,
    userId: mongoose.Types.ObjectId,
  ): CommentViewType {
    if (!comment) return null;
    return {
      id: comment._id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      addedAt: comment.addedAt,
      likesInfo: CommentLikesService.getLikesInfo(comment.likesInfo, userId),
    };
  }
}
