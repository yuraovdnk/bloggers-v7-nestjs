import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ versionKey: false })
export class Comment extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
  })
  postId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    min: 1,
    max: 1000,
    required: true,
  })
  content: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
  })
  userId: mongoose.Types.ObjectId;
  @Prop({
    type: String,
    required: true,
  })
  userLogin: string;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  addedAt: Date;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
