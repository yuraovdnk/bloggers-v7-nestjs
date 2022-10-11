import mongoose from 'mongoose';

export type BloggerSchemaType = {
  _id: mongoose.Types.ObjectId;
  name: string;
  youtubeUrl: string;
};

export type BloggerViewType = {
  id: mongoose.Types.ObjectId;
  name: string;
  youtubeUrl: string;
};
