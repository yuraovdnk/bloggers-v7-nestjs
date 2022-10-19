import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { createApp } from '../../src/main';
import * as request from 'supertest';

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
  it('LOGIN WIth correct data', async () => {
    const token = await request(app.getHttpServer())
      .post(`auth/login`)
      .send({
        login: user.login,
        password: user.password,
      })
      .expect(200);
  });
  afterAll(async () => {
    await app.close();
  });
});
