import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'test@gmail.com';
    const password = '12345678';

    return request(app.getHttpServer())
      .post('/auth/sign-up/')
      .send({ email, password })
      .expect(201)
      .then((res) => {
        const user = res.body;

        expect(user.id).toBeDefined();
        expect(user.email).toEqual(email);
      });
  });

  it('signup as a new user then get then get the currently logged in user', async () => {
    const email = 'test@gmail.com';
    const password = '12345678';

    const res = await request(app.getHttpServer())
      .post('/auth/sign-up/')
      .send({ email, password })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/me/')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
    expect(body.id).toEqual(1);
  });
});
