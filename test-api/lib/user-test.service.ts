import * as request from 'supertest';
import { baseApiUrl } from 'test-api/constants';

class UserTestService {
  static async createActiveUser(override?: any) {
    const response = await request(baseApiUrl)
      .post('/test-user/active')
      .send(override);
    return response.body;
  }
  static async createInActiveUser(override?: any) {
    const response = await request(baseApiUrl)
      .post('/test-user/inactive')
      .send(override);
    return response.body;
  }
  static async createUserWithTfaActive(override?: any) {
    const response = await request(baseApiUrl)
      .post('/test-user/tfa-active')
      .send(override);
    return response.body;
  }
}

export default UserTestService;
