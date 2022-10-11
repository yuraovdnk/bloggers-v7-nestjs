import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Blogger extends Document {
  @Prop({
    type: String,
    min: 1,
    max: 15,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    min: 1,
    max: 100,
    required: true,
  })
  youtubeUrl: string;
}
export const BloggerSchema = SchemaFactory.createForClass(Blogger);
