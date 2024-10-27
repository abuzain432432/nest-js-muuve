import * as request from 'supertest';
import {
  baseApiUrl,
  // FIFTEEN_SECONDS_IN_MS,
  // mailosaurApiKey,
  // mailosaurEmail,
  // mailosaurServerId,
} from '../constants';
// import MailosaurClient from 'mailosaur';
import { v4 as uuidv4 } from 'uuid';
// import extractOtpFromEmail from '../lib/extract-otp-from-email';
// const mailosaur = new MailosaurClient(mailosaurApiKey);

const testUserData = {
  firstName: 'John',
  lastName: 'Doe',
  email: `test-user-${uuidv4()}@mailosaur.net`,
  role: 'agent',
  password: 'password',
  passwordConfirm: 'password',
};
describe('Auth', () => {
  it('signup body validation fail', async () => {
    await request(baseApiUrl)
      .post('/auth/signup')
      .send({})
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toBeInstanceOf(Array);
      });
  });
  // NOTE mailosaur is not working as expected
  // it(
  //   'complete signup success flow',
  //   async () => {
  //     await request(baseApiUrl)
  //       .post('/auth/signup')
  //       .send(testUserData)
  //       .expect(201)
  //       .expect((response) => {
  //         expect(response.body).toHaveProperty('message');
  //       });
  //     // NOTE this is a hacky way to wait for the email to be sent and received
  //     await new Promise((resolve) => setTimeout(resolve, 5000));
  //     const email = await mailosaur.messages.get(mailosaurServerId, {
  //       sentTo: mailosaurEmail,
  //     });
  //     const otp = extractOtpFromEmail(email, testUserData.email);

  //     const activateAccountResponse = await request(baseApiUrl)
  //       .get(`/auth/activate/${otp}`)
  //       .send()
  //       .expect(200);
  //     expect(activateAccountResponse.body).toHaveProperty('message');

  //     const loginResponse = await request(baseApiUrl)
  //       .post('/auth/login')
  //       .send({
  //         email: testUserData.email,
  //         password: testUserData.password,
  //       })
  //       .expect(201);
  //     expect(loginResponse.body).toHaveProperty('token');
  //     expect(loginResponse.body).toHaveProperty('user');
  //     expect(loginResponse.body.user.active).toBe(true);
  //   },
  //   FIFTEEN_SECONDS_IN_MS,
  // );

  it('signup fail with duplicate email', async () => {
    await request(baseApiUrl)
      .post('/auth/signup')
      .send(testUserData)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toMatch(/Duplicate email/);
      });
  });
});
