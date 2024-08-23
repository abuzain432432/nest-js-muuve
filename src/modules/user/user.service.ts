import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async findAll() {
    return await this.userModel.find();
  }
  async create(data: User) {
    const user = new this.userModel(data);
    return await user.save();
  }
  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async findOneById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }
}
