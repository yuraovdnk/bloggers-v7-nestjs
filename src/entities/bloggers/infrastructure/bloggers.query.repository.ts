import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogger } from '../schemas/blogger.schema';
import mongoose, { Model } from 'mongoose';
import { PaginatedItems, QueryParamsType } from '../../../types/global-types';
import { paginator } from '../../../utils/paginator.helper';
import { BloggersMapper } from './query-service/bloggers.mapper';
import { BloggerViewType } from '../types/blogger-types';

@Injectable()
export class BloggersQueryRepository {
  constructor(@InjectModel(Blogger.name) private bloggerModel: Model<Blogger>) {}

  async getBloggers(queryParams: QueryParamsType): Promise<PaginatedItems<BloggerViewType>> {
    const filter = queryParams.searchNameTerm;
    const bloggers = await this.bloggerModel
      .find({ filter })
      .skip(queryParams.skip)
      .limit(queryParams.pageSize);

    const paginatedItems = paginator<Blogger>(bloggers, queryParams);
    return BloggersMapper.mapPaginatedBloggers(paginatedItems);
  }

  async getBloggerById(id: mongoose.Types.ObjectId): Promise<BloggerViewType> {
    const blogger = await this.bloggerModel.findOne({ _id: id });
    return BloggersMapper.mapBlogger(blogger);
  }
}
