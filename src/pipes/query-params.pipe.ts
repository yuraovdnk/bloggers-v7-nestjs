import { PipeTransform, Injectable } from '@nestjs/common';
@Injectable()
export class QueryParamsPipe implements PipeTransform {
  public transform(value: any) {
    const pageSize = +value.pageSize || 10;
    const pageNumber = +value.pageNumber || 1;
    const searchNameTerm = value.searchNameTerm ? { name: { $regex: value.SearchNameTerm } } : {};
    const skip = pageSize * (pageNumber - 1);
    return {
      pageSize,
      pageNumber,
      searchNameTerm,
      skip,
    };
  }
}
