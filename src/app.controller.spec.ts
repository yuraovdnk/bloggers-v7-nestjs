import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { createApp } from './main';
import mongoose from 'mongoose';
import { PaginatedItems } from './types/global-types';
import { BloggerViewType } from './entities/bloggers/types/blogger-types';

describe('Bloggers', () => {
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
  let createdBlogger = null;

  describe('Create blogger', () => {
    it('Should empty array of items', async () => {
      const bloggers = await request(app.getHttpServer()).get('/bloggers').expect(200);
      expect((bloggers.body as PaginatedItems<BloggerViewType>).items).toStrictEqual([]);
    });

    it('Should create Blogger with Correct data', async () => {
      const name = 'Yura';
      const youtubeUrl = 'https://www.youtube.com/c/TarunSharma7372';
      const res = await request(app.getHttpServer())
        .post('/bloggers')
        .auth('admin', 'qwerty')
        .send({ name, youtubeUrl })
        .expect(201);
      createdBlogger = res.body;
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toEqual(name);
      expect(res.body.youtubeUrl).toEqual(youtubeUrl);
    });
    it('Shouldn`t create Blogger with incorrect data', async () => {
      const name = 2;
      const youtubeUrl = 'c/TarunSharma7372';
      await request(app.getHttpServer())
        .post('/bloggers')
        .auth('admin', 'qwerty')
        .send({ name, youtubeUrl })
        .expect(400);
    });
  });
  describe('Update Blogger', () => {
    it('Should update Blogger', async () => {
      const id = createdBlogger.id;

      const newName = 'Yana';
      await request(app.getHttpServer())
        .put('/bloggers/' + id)
        .auth('admin', 'qwerty')
        .send({ name: newName, youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA' })
        .expect(204);

      const updatedBlogger = await request(app.getHttpServer())
        .get('/bloggers/' + id)
        .expect(200);
      expect(updatedBlogger.body.name).toStrictEqual(newName);
    });
  });
  describe('Delete Blogger', () => {
    it('Should delete Blogger', async () => {
      const id = createdBlogger.id;
      await request(app.getHttpServer())
        .delete('/bloggers/' + id)
        .auth('admin', 'qwerty')
        .expect(204);

      request(app.getHttpServer())
        .get('/bloggers/' + id)
        .expect(404);
    });
  });
  let createdBloggerId;
  describe('Create post for Blogger', () => {
    it('Should create posts for Blogger with correct Data', async () => {
      const name = 'Ronald';
      const youtubeUrl = 'https://www.youtube.com/c/TarunSharma7372';
      const createdBlogger = await request(app.getHttpServer())
        .post('/bloggers')
        .auth('admin', 'qwerty')
        .send({ name, youtubeUrl });

      createdBloggerId = createdBlogger.body.id;
      const postPayload = {
        title: 'about war',
        shortDescription: 'rwe',
        content: 'ewrw',
      };
      const res = await request(app.getHttpServer())
        .post(`/bloggers/${createdBloggerId}/posts`)
        .auth('admin', 'qwerty')
        .send(postPayload)
        .expect(201);
      expect(res.body.title).toEqual(postPayload.title);
      expect(res.body.shortDescription).toEqual(postPayload.shortDescription);
      expect(res.body.content).toEqual(postPayload.content);
      expect(res.body.bloggerId).toEqual(createdBloggerId);
      expect(res.body.extendedLikesInfo.newestLikes).toEqual([]);
    });
    it('shouldn`t create post for Blogger', async () => {
      const postPayload = {
        title: 'about war dsfs fsdv dfsdfsdc fgdfgd',
        shortDescription: 'rwe dfdfgdfgdfgfdvfdgfdgdfgdfgdfgfdgfd',
        content: 'ewrw',
      };
      await request(app.getHttpServer())
        .post(`/bloggers/${createdBloggerId}/posts`)
        .auth('admin', 'qwerty')
        .send(postPayload)
        .expect(400);
    });
  });

  it('should return all post by blogger', async () => {
    const posts = await request(app.getHttpServer())
      .get(`/bloggers/${createdBloggerId}/posts`)
      .expect(200);
    expect(posts.body.items).toHaveLength(1);
  });
  afterAll(async () => {
    await app.close();
  });
});
