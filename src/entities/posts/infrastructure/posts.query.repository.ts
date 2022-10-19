import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { PaginatedItems, QueryParamsType } from '../../../types/global-types';
import { paginator } from '../../../utils/paginator.helper';
import { PostsMapper } from './query-service/posts.mapper';
import { AggregatedPostType, PostViewType } from '../types/posts.types';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postsModel: Model<Post>) {}

  async getPosts(
    queryParams: QueryParamsType,
    userId?: mongoose.Types.ObjectId,
  ): Promise<PaginatedItems<PostViewType>> {
    const posts: AggregatedPostType[] = await this.postsModel.aggregate([
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

    const paginatedItems = paginator<AggregatedPostType>(posts, queryParams);
    return PostsMapper.mapPaginatedPosts(paginatedItems, userId);
  }

  async getPostsByBloggerId(
    bloggerId: mongoose.Types.ObjectId,
    queryParams: QueryParamsType,
    userId?: mongoose.Types.ObjectId,
  ): Promise<PaginatedItems<PostViewType>> {
    const posts: AggregatedPostType[] = await this.postsModel.aggregate([
      { $match: { bloggerId } },
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
    const paginatedItems = paginator<AggregatedPostType>(posts, queryParams);
    return PostsMapper.mapPaginatedPosts(paginatedItems, userId);
  }

  async getPostById(
    postId: mongoose.Types.ObjectId,
    userId?: mongoose.Types.ObjectId,
  ): Promise<PostViewType> {
    const post = await this.postsModel.aggregate([
      { $match: { _id: postId } },
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

    return PostsMapper.mapPost(post[0], userId);
  }
}
