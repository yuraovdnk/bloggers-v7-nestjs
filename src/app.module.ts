import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfig } from './configuration/config';
const configModule = ConfigModule.forRoot({
  load: [getConfig],
  isGlobal: true,
  envFilePath: ['.env'],
});
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersController } from './entities/bloggers/bloggers.controller';
import { PostsController } from './entities/posts/posts.controller';
import { CommentsController } from './entities/comments/comments.controller';
import { BloggersService } from './entities/bloggers/bloggers.service';
import { BloggersRepository } from './entities/bloggers/infrastructure/bloggers.repository';
import { PostsService } from './entities/posts/application/posts.service';
import { PostsRepository } from './entities/posts/infrastructure/posts.repository';
import { CommentsService } from './entities/comments/application/comments.service';
import { CommentsRepository } from './entities/comments/instrasctucture/comments.repository';
import { Blogger, BloggerSchema } from './entities/bloggers/schemas/blogger.schema';
import { Post, PostsSchema } from './entities/posts/schemas/post.schema';
import { AuthController } from './entities/auth/auth.controller';
import { AuthService } from './entities/auth/auth.service';
import { UsersRepository } from './entities/users/infrastructure/users.repository';
import { User, UserSchema } from './entities/users/schemas/user.schema';
import { EmailManager } from './infrastucture/notification/email.manager';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './entities/auth/strategies/local.strategy';
import { JwtStrategy } from './entities/auth/strategies/jwt.strategy';
import { Token, TokenSchema } from './entities/auth/schemas/token.schema';
import { TokenService } from './entities/auth/token.service';
import { JwtRefreshStrategy } from './entities/auth/strategies/jwt-refresh.strategy';
import { JwtRevokedStrategy } from './entities/auth/strategies/jwt-revoked.strategy';
import { UsersController } from './entities/users/users.controller';
import { UsersService } from './entities/users/application/users.service';
import { BasicStrategy } from './entities/auth/strategies/basic.strategy';
import { TestingController } from './entities/testing/testing.controller';
import { Comment, CommentSchema } from './entities/comments/schemas/comment.schema';
import { CommentsQueryRepository } from './entities/comments/instrasctucture/query-comments.repostitory';
import { BloggersQueryRepository } from './entities/bloggers/infrastructure/bloggers.query.repository';
import { PostsQueryRepository } from './entities/posts/infrastructure/posts.query.repository';
import { Like, LikeSchema } from './entities/posts/schemas/likes.schema';
import { LikePostHandler } from './entities/posts/application/use-cases/like-post.command';
import { CqrsModule } from '@nestjs/cqrs';
import { LikeCommentHandler } from './entities/comments/application/use-cases/like-comment.command';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsersQueryRepository } from './entities/users/infrastructure/users.query.repository';
const useCases = [LikePostHandler, LikeCommentHandler];
@Module({
  imports: [
    configModule,
    CqrsModule,
    MongooseModule.forRootAsync({
      imports: [configModule],
      useFactory: async (config: ConfigService) => ({
        uri:
          process.env.NODE_ENV === 'test'
            ? config.get<string>('db.mongoUriTesting')
            : config.get<string>('db.mongoUriDev'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Blogger.name, schema: BloggerSchema },
      { name: Post.name, schema: PostsSchema },
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    PassportModule,
    JwtModule.register({}),
    ThrottlerModule.forRoot({ ttl: 10, limit: 5 }),
  ],
  controllers: [
    BloggersController,
    PostsController,
    CommentsController,
    AuthController,
    UsersController,
    TestingController,
  ],
  providers: [
    BloggersService,
    BloggersRepository,
    BloggersQueryRepository,
    PostsService,
    UsersService,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    AuthService,
    UsersRepository,
    UsersQueryRepository,
    EmailManager,
    LocalStrategy,
    JwtStrategy,
    TokenService,
    JwtRefreshStrategy,
    JwtRevokedStrategy,
    BasicStrategy,
    ...useCases,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
