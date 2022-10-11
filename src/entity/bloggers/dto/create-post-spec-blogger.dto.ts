import { CreatePostDto } from '../../posts/dto/create-post.dto';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostSpecBloggerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  content: string;
}
