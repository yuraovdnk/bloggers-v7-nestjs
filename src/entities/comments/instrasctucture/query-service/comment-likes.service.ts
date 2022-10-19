import mongoose from 'mongoose';

export class CommentLikesService {
  static getLikesInfo(likesInfo, userId: mongoose.Types.ObjectId) {
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
