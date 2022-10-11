import { PipeTransform, Injectable } from '@nestjs/common';
@Injectable()
export class QueryParamsPipe implements PipeTransform {
  public transform(value: any) {
    const pageSize = +value.PageSize || 10;
    const pageNumber = +value.PageNumber || 1;
    const searchNameTerm = value.SearchNameTerm ? { name: { $regex: value.SearchNameTerm } } : {};
    const skip = pageSize * (pageNumber - 1);
    return {
      pageSize,
      pageNumber,
      searchNameTerm,
      skip,
    };
  }
}
