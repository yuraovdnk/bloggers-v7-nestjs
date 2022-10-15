import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';
import { mapErrors } from '../exceptions/mapErrors';
import { StatusesLike } from '../utils/enums';
@Injectable()
export class ParseStatusLikeEnumPipe implements PipeTransform {
  public transform(value: any) {
    if (Object.values(StatusesLike).includes(value)) {
      return value;
    }
    throw new BadRequestException(mapErrors('Some error', 'Like status'));
  }
}
