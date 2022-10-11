import { PostsRepository } from '../infrastructure/posts.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { BloggersRepository } from '../../bloggers/infrastructure/bloggers.repository';
import { mapErrors } from '../../../exceptions/mapErrors';
import mongoose, { Model } from 'mongoose';
import { CreateCommentDto } from '../../comments/dto/create-comment.dto';
import { CommentsService } from '../../comments/application/comments.service';
import { QueryParamsType } from '../../../types/global-types';
import { StatusesLike } from '../../../utils/enums';
import { UsersRepository } from '../../users/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../schemas/post.schema';
import { Like } from '../schemas/likes.schema';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected bloggersRepository: BloggersRepository,
    protected commentsService: CommentsService,
    protected usersRepostitory: UsersRepository,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async createPost(createPost: CreatePostDto) {
    const blogger = await this.bloggersRepository.getBloggerById(createPost.bloggerId);
    if (!blogger) throw new BadRequestException(mapErrors('blogger is not defined', 'bloggerId'));
    const newPost = {
      title: createPost.title,
      shortDescription: createPost.shortDescription,
      content: createPost.content,
      bloggerId: blogger._id,
    };
    return await this.postsRepository.createPost(newPost);
  }

  async updatePost(postId: mongoose.Types.ObjectId, updatePostDto: CreatePostDto): Promise<boolean> {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) throw new NotFoundException();
    return this.postsRepository.updatePost(postId, updatePostDto);
  }

  async deletePost(postId: mongoose.Types.ObjectId): Promise<boolean> {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) throw new NotFoundException();
    return this.postsRepository.deletePost(postId);
  }

  async setLikeStatusForPost(postId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, likeStatus: string) {
    // const newLike = {
    //   userId,
    //   postId,
    //   likeStatus,
    // };
    // console.log(newLike);
    // const t = await this.likeModel.insertMany(newLike);
    // console.log(t);

    // const tttt = await this.postModel.aggregate([
    //   { $addFields: { userId: '$_id' } },
    //   {
    //     $lookup: {
    //       localField: 'userId',
    //       from: 'likes',
    //       foreignField: 'postId',
    //       as: 'likesInfo.likes',
    //     },
    //   },
    //   {
    //     $addFields: {
    //       'likesInfo.countLikes': {
    //         $size: {
    //           $filter: {
    //             input: '$likesInfo.likes',
    //             cond: { $eq: ['$$this.likeStatus', 'Like'] },
    //           },
    //         },
    //       },
    //       'likesInfo.countDislikes': {
    //         $size: {
    //           $filter: {
    //             input: '$likesInfo.likes',
    //             cond: { $eq: ['$$this.likeStatus', 'Dislike'] },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $addFields: {
    //       'likesInfo.likes': { $slice: ['$likesInfo.likes', -2] },
    //     },
    //   },
    // ]);
    // return tttt;

    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    const user = await this.usersRepostitory.findById(userId);

    if (likeStatus === StatusesLike.None) {
      return await this.postsRepository.unsetLike(postId, userId);
    }
    const result = await this.postsRepository.setLikeStatus(postId, userId, user.accountData.login, likeStatus);
    return result;
  }
}
