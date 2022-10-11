import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';
import { mapErrors } from '../exceptions/mapErrors';
@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  public transform(value: any): mongoose.Types.ObjectId {
    try {
      return new mongoose.Types.ObjectId(value);
    } catch (error) {
      throw new BadRequestException(mapErrors('Incorrect Id', 'Id'));
    }
  }
}
