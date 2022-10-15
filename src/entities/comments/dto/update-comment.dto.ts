import { MaxLength, Min, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @MinLength(20)
  @MaxLength(300)
  content: string;
}
