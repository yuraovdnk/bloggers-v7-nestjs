import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusesLike } from '../../../utils/enums';

export class SetLikeDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(StatusesLike))
  likeStatus: StatusesLike;
}
