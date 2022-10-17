import mongoose from 'mongoose';

export type AggregatedPostType = {
  _id: mongoose.Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: mongoose.Types.ObjectId;
  addedAt: Date;
  likesInfo: {
    likes: [
      {
        _id: mongoose.Types.ObjectId;
        postId: mongoose.Types.ObjectId;
        userId: mongoose.Types.ObjectId;
        addedAt: Date;
        likeStatus: string;
        userLogin: string;
      },
    ];
    countLikes: number;
    countDislikes: number;
  };
};
export type PostViewType = {
  id: mongoose.Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: mongoose.Types.ObjectId;
  bloggerName: string;
  addedAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: [];
  };
};
