import { IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import mongoose from 'mongoose';
import { CreatePostSpecBloggerDto } from '../../bloggers/dto/create-post-spec-blogger.dto';

export class CreatePostDto extends CreatePostSpecBloggerDto {
  //TODO: change from objectId to string
  @IsNotEmpty()
  @IsMongoId()
  bloggerId: mongoose.Types.ObjectId;
}
