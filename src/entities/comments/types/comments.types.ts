import mongoose from 'mongoose';

export type CommentInputType = {
  content: string;
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  userLogin: string;
  addedAt: Date;
};

export type CommentViewType = {
  id: mongoose.Types.ObjectId;
  content: string;
  userId: mongoose.Types.ObjectId;
  userLogin: string;
  addedAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};
export type AggregatedCommentType = {
  _id: mongoose.Types.ObjectId;
  posId: mongoose.Types.ObjectId;
  content: string;
  userId: mongoose.Types.ObjectId;
  userLogin: string;
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
