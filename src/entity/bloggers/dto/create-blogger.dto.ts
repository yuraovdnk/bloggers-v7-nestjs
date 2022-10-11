import { IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateBloggerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  name: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
  youtubeUrl: string;
}
