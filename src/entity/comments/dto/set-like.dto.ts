import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusesLike } from '../../../utils/enums';

export class SetLikeDto {
  @IsNotEmpty()
  @IsString()
  //@IsEnum(StatusesLike)
  likeStatus: string;
}
