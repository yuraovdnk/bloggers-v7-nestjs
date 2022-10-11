import { PaginatedItems } from '../../../../types/global-types';
import { Blogger } from '../../schemas/blogger.schema';

export class BloggersMapper {
  static async mapPaginatedBloggers(paginatedBloggers: PaginatedItems<Blogger>) {
    const items = paginatedBloggers.items.map((item) => this.mapBlogger(item));
    return {
      ...paginatedBloggers,
      items,
    };
  }
  static mapBlogger(blogger: Blogger) {
    if (!blogger) return null;
    return {
      id: blogger._id,
      name: blogger.name,
      youtubeUrl: blogger.youtubeUrl,
    };
  }
}
