import { Post } from '../../schemas/post.schema';
import mongoose from 'mongoose';
import { AggregatedPostType, PostViewType } from '../../types/posts.types';
import { PaginatedItems } from '../../../../types/global-types';

export class PostsMapper {
  static mapPaginatedPosts(
    pagingPosts: PaginatedItems<AggregatedPostType>,
    userId: mongoose.Types.ObjectId,
  ) {
    const items = pagingPosts.items.map((item) => this.mapPost(item, userId));
    return {
      ...pagingPosts,
      items,
    };
  }
  static mapPost(post: AggregatedPostType, userId: mongoose.Types.ObjectId) {
    if (!post) return null;
    return {
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId._id,
      // bloggerName: post.bloggerId.name,
      addedAt: post.addedAt,
      extendedLikesInfo: this.mapLikes(post.likesInfo, userId),
    };
  }
  private static mapLikes(likesInfo, userId: mongoose.Types.ObjectId) {
    const myStatus = likesInfo.likes.find(
      (item) => userId && item.userId._id.toString() === userId.toString(),
    );
    return {
      likesCount: likesInfo.countLikes,
      dislikesCount: likesInfo.countDislikes,
      myStatus: myStatus?.likeStatus ?? 'None',
      newestLikes: likesInfo.likes.map((item) => {
        return {
          userId: item.userId,
          login: item.userLogin,
          addedAt: item.addedAt,
        };
      }),
    };
  }
}
