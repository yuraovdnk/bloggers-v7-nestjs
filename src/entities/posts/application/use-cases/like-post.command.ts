import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../schemas/post.schema';
import { Like } from '../../schemas/likes.schema';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { StatusesLike } from '../../../../utils/enums';

export class LikePostCommand {
  constructor(
    readonly userId: mongoose.Types.ObjectId,
    readonly postId: mongoose.Types.ObjectId,
    readonly likeStatus: string,
  ) {}
}
@CommandHandler(LikePostCommand)
export class LikePostHandler implements ICommandHandler<LikePostCommand> {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: LikePostCommand) {
    const { userId, postId, likeStatus } = command;
    const post = await this.postModel.findOne({ _id: postId });

    if (!post) {
      throw new NotFoundException();
    }
    const user = await this.usersRepository.findById(userId);

    if (likeStatus === StatusesLike.None) {
      const res = await this.likeModel.deleteOne({ $and: [{ parentId: postId }, { userId }] });
      return res.acknowledged;
    }
    const res = await this.likeModel.updateOne(
      { $and: [{ parentId: postId }, { userId }] },
      { userId, parentId: postId, likeStatus, userLogin: user.accountData.login },
      { upsert: true, new: true },
    );
    return res.acknowledged;
  }
}
