import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { createApp } from './main';
import * as request from 'supertest';

describe('Posts', () => {
  jest.setTimeout(1000 * 60 * 3);
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = await createApp(app);
    await app.init();
    await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
  });

  describe('Create post', () => {
    it('should create post', async () => {
      const name = 'Ronald';
      const youtubeUrl = 'https://www.youtube.com/c/TarunSharma7372';
      const createdBlogger = await request(app.getHttpServer())
        .post('/bloggers')
        .auth('admin', 'qwerty')
        .send({ name, youtubeUrl });

      const postPayload = {
        title: 'about war',
        shortDescription: 'rwe',
        content: 'ewrw',
        bloggerId: createdBlogger.body.id,
      };
      const createdPost = await request(app.getHttpServer())
        .post(`/posts`)
        .auth('admin', 'qwerty')
        .send(postPayload)
        .expect(201);
      expect(createdPost.body.title).toEqual(postPayload.title);
      expect(createdPost.body.shortDescription).toEqual(postPayload.shortDescription);
      expect(createdPost.body.content).toEqual(postPayload.content);
      expect(createdPost.body.bloggerId).toEqual(createdBlogger.body.id);
      expect(createdPost.body.extendedLikesInfo.newestLikes).toEqual([]);

      const postById = await request(app.getHttpServer())
        .get(`/posts/` + createdPost.body.id)
        .expect(200);
      expect(postById.body.)
    });
  });
  describe('fdgfd', () => {
    it('should fgf', async () => {
      const posts = await request(app.getHttpServer()).get(`/bloggers/posts`).expect(200);
      expect(posts.body.items).toHaveLength(1);
    });
  });
});
