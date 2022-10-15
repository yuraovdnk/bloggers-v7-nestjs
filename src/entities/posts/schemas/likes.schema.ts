import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Like extends Document {
  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  userLogin: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
  })
  parentId: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  likeStatus: string;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  addedAt: Date;
}
export const LikeSchema = SchemaFactory.createForClass(Like);
