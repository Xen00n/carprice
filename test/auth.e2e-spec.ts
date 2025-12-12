import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('handles signin request', () => {
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email: 'thisisunique1@gmail.com', password: 'mypassword' })
            .expect(201)
            .then((res) => {
                expect(res.body.id).toBeDefined();
                expect(res.body.email).toEqual('thisisunique1@gmail.com');
            });
    });
});
