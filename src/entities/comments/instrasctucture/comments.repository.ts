import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import { Injectable } from '@nestjs/common';
import { CommentInputType } from '../types/comments.types';

@Injectable()
export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async createComment(comment: CommentInputType): Promise<mongoose.Types.ObjectId> {
    const res: Comment = await this.commentModel.create(comment);
    return res._id;
  }
  async updateComment(commentId: mongoose.Types.ObjectId, content: string): Promise<boolean> {
    const result = await this.commentModel.updateOne({ _id: commentId }, { $set: { content } });
    return result.acknowledged;
  }
  async deleteComment(commentId: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await this.commentModel.deleteOne({ _id: commentId });
    return result.acknowledged;
  }

  async setLikeStatus(
    commentId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    likeStatus: string,
  ) {
    const findByCommentIdAndUserId = await this.commentModel.findOne({
      $and: [{ _id: commentId }, { 'likesInfo.likes': { $elemMatch: { userId } } }],
    });
    if (findByCommentIdAndUserId) {
      const res = await this.commentModel.updateOne(
        {
          $and: [
            { _id: commentId },
            { 'likesInfo.likes': { $elemMatch: { userId } } },
            { 'likesInfo.likes': { $elemMatch: { likeStatus: { $ne: likeStatus } } } },
          ],
        },
        { $set: { 'likesInfo.likes.$[elem].likeStatus': likeStatus } },
        { arrayFilters: [{ 'elem.userId': userId }] },
      );
      return res.acknowledged;
    }
    return null;
  }

  async setNewLike(
    commentId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    likeStatus: string,
  ) {
    const res = await this.commentModel.updateOne(
      { _id: commentId },
      {
        $push: { 'likesInfo.likes': { userId, likeStatus } },
      },
    );
    return res.matchedCount;
  }

  async unsetLike(commentId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    const res = await this.commentModel.updateOne(
      { _id: commentId },
      { $pull: { 'likesInfo.likes': { userId } } },
    );
    return res.matchedCount;
  }
  async getCommentById(commentId: mongoose.Types.ObjectId) {
    return this.commentModel.findOne({ _id: commentId });
  }
}
