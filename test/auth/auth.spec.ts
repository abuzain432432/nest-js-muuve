import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserService } from 'src/modules/user/user.service';
import { ConfigModule } from 'src/modules/config/config.module';
import { MESSAGES } from 'src/common/messages';
import { UsersModule } from 'src/modules/user/user.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/modules/user/schemas/user.schema';
import EmailNotificationModule__Mock__ from 'src/modules/email-notification/__mock__/email-notification.module__mock__';
import { EmailNotificationModule } from 'src/modules/email-notification/email-notification.module';
import { setupGlobalPipes } from 'src/common/lib/setup-global-pipes.lib';
import UserService__mock__ from 'src/modules/user/__mock__/user.service__mock__';

import { signupFixtures } from 'src/modules/auth/__fixtures__/auth.fixture';
class MockedUserModel {
  constructor(private _: any) {}
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule, ConfigModule, EmailNotificationModule],
    })
      .overrideModule(EmailNotificationModule)
      .useModule(EmailNotificationModule__Mock__)
      .overrideProvider(UserService)
      .useValue(UserService__mock__)
      .overrideProvider(getModelToken(User.name))
      .useValue(MockedUserModel)

      .compile();

    app = moduleFixture.createNestApplication();
    setupGlobalPipes(app);
    await app.init();

    userService = moduleFixture.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/auth/activate-account (POST)', () => {
    it('should activate the account successfully', async () => {
      const user = {
        active: false,
        save: jest.fn().mockResolvedValue(undefined),
      };
      jest
        .spyOn(userService, 'findOneByOtp')
        .mockResolvedValueOnce(user as any);

      const response = await request(app.getHttpServer())
        .get('/auth/activate/976769')
        .send()
        .expect(200);

      expect(response.body).toEqual({ message: MESSAGES.ACCOUNT_ACTIVATED });
      expect(user.active).toBe(true);
    });
    it('should throw an exception (invalid otp token)', async () => {
      jest.spyOn(userService, 'findOneByOtp').mockImplementationOnce(() => {
        throw new BadRequestException(MESSAGES.INVALID_OTP_TOKEN);
      });

      const response = await request(app.getHttpServer())
        .get('/auth/activate/976769')
        .send();

      expect(response.body).toEqual({
        statusCode: 400,
        message: MESSAGES.INVALID_OTP_TOKEN,
        error: 'Bad Request',
      });
    });
  });
  describe('/auth/signup (POST)', () => {
    it('should signup successfully', async () => {
      const user = {
        ...signupFixtures.validSignupDto,
        toObject: () => signupFixtures.validSignupDto,
        save: jest.fn().mockResolvedValue(undefined),
      };

      // Mock the userService to return the user object on create
      jest.spyOn(userService, 'create').mockResolvedValueOnce(user as any);

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupFixtures.validSignupDto);

      expect(response.body).toEqual({
        message: MESSAGES.SIGNUP_SUCCESS,
        token: expect.any(String),
      });
    });
    it('should throw an exception (missing body required values)', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
      expect(userService.create).not.toHaveBeenCalled();
    });
  });
});
