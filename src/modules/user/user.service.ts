import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, SaveOptions } from 'mongoose';
import { MESSAGES } from 'src/common/messages';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async findAll() {
    return await this.userModel.find();
  }
  async create(data: User, options?: SaveOptions) {
    const user = new this.userModel(data);
    return await user.save(options);
  }
  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async findOneById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }
  async findOneByOtp(hashedOtp: string) {
    const user = await this.userModel.findOne({
      otp: hashedOtp,
      otpExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      throw new BadRequestException(MESSAGES.INVALID_OTP_TOKEN);
    }
    return user;
  }
  async update(id: string, updateData: Partial<User>) {
    return await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }
  async updateByCustomerId(customerId: string, updateData: Partial<User>) {
    return await this.userModel.findOneAndUpdate({ customerId }, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async updateByEmail(email: string, updateData: Partial<User>) {
    return await this.userModel.updateOne({ email }, updateData, {
      new: true,
      runValidators: true,
    });
  }
  async saveTfaSecret(userId: string, secret: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { tfaSecret: secret },
      { new: true },
    );
  }
  async findUserByTfaRecoveryToken(token: string) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { tfaRecoveryToken: token },
      {
        $set: {
          tfaRecoveryToken: '',
          tfa: false,
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new BadRequestException(MESSAGES.INVALID_OTP_TOKEN);
    }
    return updatedUser;
  }
}
