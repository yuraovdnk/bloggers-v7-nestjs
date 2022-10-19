import mongoose from 'mongoose';
import { AggregatedPostType } from '../../types/posts.types';
import { PaginatedItems } from '../../../../types/global-types';
import { PostLikesService } from './post-likes.service';

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
      bloggerName: post.bloggerName,
      addedAt: post.addedAt,
      extendedLikesInfo: PostLikesService.getLikesInfo(post.likesInfo, userId),
    };
  }
}
