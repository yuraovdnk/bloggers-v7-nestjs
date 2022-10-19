import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { createApp } from './main';

describe('Auth', () => {
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
  const user = {
    login: 'Yurii',
    email: 'ovddqq9@gmail.com',
    password: '123456',
  };
  const token = null;
  it('register user', async () => {
    await request(app.getHttpServer())
      .post(`/users`)
      .auth('admin', 'qwerty')
      .send(user)
      .expect(201);
  });
  it('login with correct data', async () => {
    const login = await request(app.getHttpServer())
      .post(`/auth/login`)
      .send({
        login: user.login,
        password: user.password,
      })
      .expect(200);

    const cookies = login.header['set-cookie'];
    await request(app.getHttpServer()).post(`/auth/logout`).set('Cookie', cookies);
    expect(204);
  });
  it('refresh token', async () => {
    const login = await request(app.getHttpServer())
      .post(`/auth/login`)
      .send({
        login: user.login,
        password: user.password,
      })
      .expect(200);

    const cookies = login.header['set-cookie'];
    const refreshToken = await request(app.getHttpServer())
      .post(`/auth/refresh-token`)
      .set('Cookie', cookies)
      .expect(200);
    expect(refreshToken.header['set-cookie']).toEqual(cookies);
  });

  afterAll(async () => {
    await app.close();
  });
});
