// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
//
// @Schema()
// class Like extends Document {
//   @Prop({
//     type: MongooseSchema.Types.ObjectId,
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
//   addedAt: Date;
// }
// const LikeSchema = SchemaFactory.createForClass(Like);
//
// @Schema()
// export class LikesInfo extends Document {
//   @Prop({ type: [LikeSchema] })
//   likes: [Like];
//
//   @Prop({ type: Number })
//   countLikes: number;
//
//   @Prop({ type: Number })
//   countDislikes: number;
// }
// export const LikeInfoSchema = SchemaFactory.createForClass(LikesInfo);
