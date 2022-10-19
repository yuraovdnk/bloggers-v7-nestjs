import { AggregatedCommentType, CommentViewType } from '../../types/comments.types';
import mongoose from 'mongoose';
import { PaginatedItems } from '../../../../types/global-types';

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
      likesInfo: this.mapLikes(comment.likesInfo, userId),
    };
  }
  private static mapLikes(likesInfo, userId: mongoose.Types.ObjectId) {
    const myStatus = likesInfo.likes.find(
      (item) => userId && item.userId.toString() === userId.toString(),
    );
    return {
      likesCount: likesInfo.countLikes,
      dislikesCount: likesInfo.countDislikes,
      myStatus: myStatus?.likeStatus ?? 'None',
    };
  }
}
