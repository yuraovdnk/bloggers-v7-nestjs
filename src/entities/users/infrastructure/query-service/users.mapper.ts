import { PaginatedItems } from '../../../../types/global-types';
import { User } from '../../schemas/user.schema';
import { UserViewType } from '../../types/users.types';

export class UsersMapper {
  static mapPaginatedUsers(users: PaginatedItems<User>): PaginatedItems<UserViewType> {
    const items = users.items.map((item) => this.mapUser(item));
    return {
      ...users,
      items,
    };
  }
  static mapUser(user: User): UserViewType {
    return {
      id: user._id,
      login: user.accountData.login,
    };
  }
}
