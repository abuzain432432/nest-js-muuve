import { Injectable } from '@nestjs/common';
type User = {
  password: string;
  email: string;
  passwordChangedAt: Date;
  firstName: string;
  id: string;
  lastName: string;
};
@Injectable()
export class PropertyService {
  private dummyData: User[] = [
    {
      password: 'password',
      email: 'email',
      passwordChangedAt: new Date('2021-01-01'),
      firstName: 'Ali',
      lastName: 'umer',
      id: 'zyz',
    },
  ];
  async findAll() {
    await new Promise((res) => setTimeout(res, 5000));
    return this.dummyData;
  }
  findOneByEmail(email: string) {
    const user = this.dummyData.find((user) => user.email === email);
    return user;
  }
  findOneById(id: string) {
    const user = this.dummyData.find((user) => user.id === id);
    return user;
  }
}