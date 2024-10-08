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
import { GetTourResponseDto } from './dtos/get-tour-response.dto';
import { TourStatusEnum } from './enums/tour-status.enum';
import { MESSAGES } from 'src/common/messages/index';
import { plainToInstance } from 'class-transformer';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { GetToursResponseDto } from './dtos/get-tours-response.dto';
import { TourStatsResponseDto } from './dtos/tour-stats-response.dto';
import { dateRanges } from 'src/common/lib/date-ranges';
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
    return transformToDto(GetTourResponseDto, savedTour);
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

    return transformToDto(GetTourResponseDto, tour);
  }

  async update(id: string, updateData: Partial<Tour>) {
    return await this.tourModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }
  async getMyTours(user: IUser): Promise<GetToursResponseDto> {
    if (user.role === RolesEnum.TENANT) {
      const tours = await this.tourModel.find({ tenant: user._id });
      return {
        data: plainToInstance(GetTourResponseDto, tours, {
          excludeExtraneousValues: true,
        }),
      };
    }
    const tours = await this.tourModel.find({ owner: user._id });
    return {
      data: plainToInstance(GetTourResponseDto, tours, {
        excludeExtraneousValues: true,
      }),
    };
  }

  async geToursStats(user: IUser, year: number): Promise<TourStatsResponseDto> {
    const {
      currentWeekEnd,
      currentWeekStart,
      endOfYear,
      previousWeekEnd,
      previousWeekStart,
      startOfYear,
    } = dateRanges(year);

    const monthlyOverview = await this.tourModel.aggregate([
      {
        $match: {
          owner: user._id,
          createdAt: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          accepted: {
            $sum: {
              $cond: [
                { $eq: ['$_id.status', TourStatusEnum.APPROVED] },
                '$count',
                0,
              ],
            },
          },
          rejected: {
            $sum: {
              $cond: [
                { $eq: ['$_id.status', TourStatusEnum.REJECTED] },
                '$count',
                0,
              ],
            },
          },
          pending: {
            $sum: {
              $cond: [
                { $eq: ['$_id.status', TourStatusEnum.PENDING] },
                '$count',
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          month: '$_id',
          accepted: 1,
          rejected: 1,
          pending: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    const defaultStats = {
      accepted: 0,
      rejected: 0,
      pending: 0,
    };

    const toursStats = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyOverview.find(
        (item) => item.month === i + 1,
      ) || { month: i + 1 };
      return Object.assign({}, defaultStats, monthData);
    });

    const previousWeekToursRequests = await this.tourModel.countDocuments({
      owner: user._id,
      createdAt: {
        $gte: previousWeekStart,
        $lte: previousWeekEnd,
      },
    });

    const currentWeekToursRequests = await this.tourModel.countDocuments({
      owner: user._id,
      createdAt: {
        $gte: currentWeekStart,
        $lte: currentWeekEnd,
      },
    });

    const increasePercentage =
      previousWeekToursRequests > 0
        ? ((currentWeekToursRequests - previousWeekToursRequests) /
            previousWeekToursRequests) *
          100
        : currentWeekToursRequests > 0
          ? 100
          : 0;

    return transformToDto(TourStatsResponseDto, {
      stats: toursStats,
      increasePercentage,
    });
  }
}
