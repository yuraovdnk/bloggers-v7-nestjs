import mongoose from 'mongoose';
import { statusesLike } from '../../../bloggers/types/blogger-enums';

export class PostLikesService {
  static getLikesInfo(likesInfo, userId: mongoose.Types.ObjectId) {
    const myStatus = likesInfo.likes.find(
      (item) => userId && item.userId.toString() === userId.toString(),
    );

    return {
      likesCount: likesInfo.countLikes,
      dislikesCount: likesInfo.countDislikes,
      myStatus: myStatus?.likeStatus ?? 'None',
      newestLikes: this.mapNewestLike(likesInfo.likes),
    };
  }
  private static mapNewestLike(newestLikes) {
    const resultMap = newestLikes.filter((item) => item.likeStatus === statusesLike.Like);
    return resultMap
      .slice(-3)
      .reverse()
      .map((item) => {
        return {
          userId: item.userId,
          login: item.userLogin,
          addedAt: item.addedAt,
        };
      });
  }
}
