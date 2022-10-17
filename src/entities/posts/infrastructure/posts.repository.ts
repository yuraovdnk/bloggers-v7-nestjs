import { Post } from '../schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postsModel: Model<Post>) {}

  async createPost(createPostDto: CreatePostDto): Promise<mongoose.Types.ObjectId> {
    const newPost: Post = await this.postsModel.create(createPostDto);
    return newPost._id;
  }

  async getPostById(postId: mongoose.Types.ObjectId) {
    return this.postsModel.findOne({ _id: postId });
  }
  async updatePost(
    postId: mongoose.Types.ObjectId,
    updatePostDto: CreatePostDto,
  ): Promise<boolean> {
    const result = await this.postsModel.updateOne(
      { _id: postId },
      {
        title: updatePostDto.title,
        shortDescription: updatePostDto.shortDescription,
        content: updatePostDto.content,
        bloggerId: updatePostDto.bloggerId,
      },
    );
    return result.acknowledged;
  }

  async deletePost(postId: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await this.postsModel.deleteOne({ _id: postId });
    return result.acknowledged;
  }

  async setLikeStatus(
    postId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    userLogin: string,
    likeStatus: string,
  ) {
    const postByUserAndPostId: Post = await this.postsModel.findOne({
      $and: [{ _id: postId }, { 'likesInfo.likes': { $elemMatch: { userId } } }],
    });

    if (postByUserAndPostId) {
      const res = await this.postsModel.updateOne(
        {
          $and: [
            { _id: postId },
            { 'likesInfo.likes': { $elemMatch: { userId } } },
            { 'likesInfo.likes': { $elemMatch: { likeStatus: { $ne: likeStatus } } } },
          ],
        },
        { $set: { 'likesInfo.likes.$[elem].likeStatus': likeStatus } },
        { arrayFilters: [{ 'elem.userId': userId }] },
      );
      return res.acknowledged;
    }
    const res = await this.postsModel.updateOne(
      { _id: postId },
      {
        $push: { 'likesInfo.likes': { userId, userLogin, likeStatus } },
      },
    );
    return res.acknowledged;
  }

  async unsetLike(postId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    const res = await this.postsModel.updateOne(
      { _id: postId },
      { $pull: { 'likesInfo.likes': { userId } } },
    );
    return res.matchedCount;
  }
}
