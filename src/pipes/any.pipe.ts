import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../entities/users/infrastructure/users.repository';

@Injectable()
export class AnyPipe implements PipeTransform {
  constructor(protected userRepo: UsersRepository) {}
  public transform(value: any): any {
    console.log(value);
  }
}
