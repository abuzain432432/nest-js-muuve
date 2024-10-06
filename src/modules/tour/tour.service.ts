import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Tour, TourDocument } from './schemas/tour.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTourDto } from './dtos/create-tour.dto';
import { IUser } from 'src/common/types/user.type';
import { transformToDto } from 'src/common/lib/transform-to-dto.lib';
import { TourResponseDto } from './dtos/tour-response.dto';
import { TourStatusEnum } from './enums/tour-status.enum';
import { MESSAGES } from 'src/common/messages/index';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tour.name)
    private readonly tourModel: Model<TourDocument>,
  ) {}

  async create(data: CreateTourDto, user: IUser) {
    const tourData = {
      ...data,
      tenant: user._id,
      status: TourStatusEnum.PENDING,
    };
    const tour = new this.tourModel(tourData);
    const savedTour = await tour.save();
    return { data: transformToDto(TourResponseDto, savedTour) };
  }

  async approveTour(tourId: string, user: IUser) {
    return this.updateTourStatus(tourId, user, TourStatusEnum.APPROVED);
  }

  async rejectTour(tourId: string, user: IUser) {
    return this.updateTourStatus(tourId, user, TourStatusEnum.REJECTED);
  }

  async updateTourStatus(tourId: string, user: IUser, status: TourStatusEnum) {
    const tour = await this.tourModel.findById(tourId);

    if (!tour) {
      throw new BadRequestException('Tour not found');
    }
    if (tour.owner.toString() !== user._id.toString()) {
      throw new UnauthorizedException(MESSAGES.UNAUTHORIZED_ACTION);
    }
    if (tour.status !== TourStatusEnum.PENDING) {
      throw new BadRequestException('You can only reject pending tours');
    }
    tour.status = status;
    await tour.save();

    return { data: transformToDto(TourResponseDto, tour) };
  }

  async update(id: string, updateData: Partial<Tour>) {
    return await this.tourModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }
  async getMyPropertiesTours(user: IUser) {
    const tours = await this.tourModel.find({ owner: user._id });
    return {
      data: plainToInstance(TourResponseDto, tours, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
