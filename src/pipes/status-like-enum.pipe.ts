import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { mapErrors } from '../exceptions/mapErrors';
import { StatusesLike } from '../utils/enums';
@Injectable()
export class ParseStatusLikeEnumPipe implements PipeTransform {
  public transform(value: any) {
    if (value && Object.values(StatusesLike).includes(value)) {
      return value;
    }
    throw new BadRequestException(mapErrors('Some error', 'likeStatus'));
  }
}
