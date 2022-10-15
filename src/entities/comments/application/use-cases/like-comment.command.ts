import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { StatusesLike } from '../../../../utils/enums';
import { Like } from '../../../posts/schemas/likes.schema';
import { Comment } from '../../schemas/comment.schema';

export class LikeCommentCommand {
  constructor(
    readonly userId: mongoose.Types.ObjectId,
    readonly commentId: mongoose.Types.ObjectId,
    readonly likeStatus: string,
  ) {}
}
@CommandHandler(LikeCommentCommand)
export class LikeCommentHandler implements ICommandHandler<LikeCommentCommand> {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: LikeCommentCommand) {
    const { userId, commentId, likeStatus } = command;
    const post = await this.commentModel.findOne({ _id: commentId });
    if (!post) {
      throw new NotFoundException();
    }
    const user = await this.usersRepository.findById(userId);

    if (likeStatus === StatusesLike.None) {
      const res = await this.likeModel.deleteOne({ $and: [{ parentId: commentId }, { userId }] });
      return res.acknowledged;
    }
    const res = await this.likeModel.updateOne(
      { $and: [{ parentId: commentId }, { userId }] },
      { userId, parentId: commentId, likeStatus, userLogin: user.accountData.login },
      { upsert: true, new: true },
    );
    return res.acknowledged;
  }
}
