import mongoose, { Document } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Post extends Document {
  @Prop({
    type: String,
    max: 30,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    min: 1,
    max: 100,
    required: true,
  })
  shortDescription: string;

  @Prop({
    type: String,
    min: 1,
    max: 1000,
    required: true,
  })
  content: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
  })
  bloggerId: mongoose.Types.ObjectId;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  addedAt: Date;
}
export const PostsSchema = SchemaFactory.createForClass(Post);

// class Like extends Document {
//   @Prop({
//     type: mongoose.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   })
//   userId: mongoose.Types.ObjectId;
//
//   @Prop({ type: String, required: true })
//   likeStatus: string;
//
//   @Prop({
//     type: Date,
//     default: Date.now(),
//   })
//   addedAt?: Date;
// }
// //const LikeSchema = SchemaFactory.createForClass(Like);
//
// class LikesInfo {
//   @Prop({ type: [Like], default: [] })
//   likes: Like[];
//
//   // countLikes: {
//   //   type: Number,
//   // },
//   // countDislikes: {
//   //   type: Number,
//   // }
// }
// //const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);
//
// @Schema({ versionKey: false })
// export class Post extends Document {
//   @Prop({
//     type: String,
//     max: 30,
//     required: true,
//   })
//   title: string;
//
//   @Prop({
//     type: String,
//     min: 1,
//     max: 100,
//     required: true,
//   })
//   shortDescription: string;
//
//   @Prop({
//     type: String,
//     min: 1,
//     max: 1000,
//     required: true,
//   })
//   content: string;
//
//   @Prop({
//     type: mongoose.Types.ObjectId,
//     ref: 'Blogger',
//     required: true,
//   })
//   bloggerId: mongoose.Types.ObjectId;
//
//   @Prop({
//     type: Date,
//     default: Date.now(),
//   })
//   addedAt: Date;
//
//   @Prop({ type: LikesInfo, default: { likes: [] } })
//   likesInfo: LikesInfo;
// }
// export const PostsSchema = SchemaFactory.createForClass(Post);
