import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Token extends Document {
  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  refreshToken: string;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
