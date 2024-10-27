import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { transformToDto } from 'src/common/lib/transform-to-dto.lib';
import { IUser } from 'src/common/types/user.type';

import { CreatePropertyDto } from './dtos/create-property.dto';
import { PropertyStatsResponseDto } from './dtos/property-stats-response.dto';
import { PropertyStatusEnum } from './enums/property-status.enum';
import { Property, PropertyDocument } from './schemas/property.schema';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<PropertyDocument>,
  ) {}
  async create(data: CreatePropertyDto, user: IUser) {
    // TODO here we will need to manage the owner of the property b/c it can be added by the sub user
    const property = new this.propertyModel({
      ...data,
      status: PropertyStatusEnum.DRAFT,
      owner: user._id,
      location: {
        type: 'Point',
        coordinates: [
          data.location.coordinates[0],
          data.location.coordinates[1],
        ],
      },
    });
    return await property.save();
  }
  async update(id: string, property: Partial<Property>) {
    return await this.propertyModel.findByIdAndUpdate(id, property, {
      new: true,
      runValidators: true,
    });
  }
  async publishPropertyOfAgentOrSubUser(id: string) {
    //TODO Before updating it to available, we should check if the property belongs to ones requesting to publish it
    const publishedProperty = await this.propertyModel.findByIdAndUpdate(
      id,
      {
        status: PropertyStatusEnum.AVAILABLE,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!publishedProperty) {
      throw new NotFoundException('Property not found');
    }
    return publishedProperty;
  }
  async findOneById(id: string) {
    const user = await this.propertyModel.findById(id);
    return user;
  }
  async gePropertiesStats(user: IUser, year: number) {
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31`);
    const monthlyOverview = await this.propertyModel.aggregate([
      {
        $match: {
          // TODO you can uncomment this line to filter by the user
          // owner: user._id,
          // listedAt: {
          // $gte: startOfYear,
          // $lte: endOfYear,
          // },
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
            // month: { $month: '$listedAt' },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          available: {
            $sum: {
              $cond: [
                { $eq: ['$_id.status', PropertyStatusEnum.AVAILABLE] },
                '$count',
                0,
              ],
            },
          },
          occupied: {
            $sum: {
              $cond: [
                { $eq: ['$_id.status', PropertyStatusEnum.OCCUPIED] },
                '$count',
                0,
              ],
            },
          },
          pendingPayment: {
            $sum: {
              $cond: [
                { $eq: ['$_id.status', PropertyStatusEnum.PENDING_PAYMENT] },
                '$count',
                0,
              ],
            },
          },
          draft: {
            $sum: {
              $cond: [
                { $eq: ['$_id.status', PropertyStatusEnum.DRAFT] },
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
          available: 1,
          occupied: 1,
          pending: 1,
          draft: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // Step 3: Aggregate total applications requests for the user
    // const totalApplicationsRequests = await this.applicationModel.aggregate([
    //   {
    //     $match: {
    //       owner: user._id,
    //       createdAt: {
    //         $gte: startOfYear,
    //         $lte: endOfYear,
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: { $month: '$createdAt' },
    //       count: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       total: { $sum: '$count' },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       total: 1,
    //     },
    //   },
    // ]);

    // // Step 6: Calculate the number of application requests for the current and previous weeks
    // const currentWeekApplicationsRequests =
    //   await this.applicationModel.countDocuments({
    //     owner: user._id,
    //     createdAt: {
    //       $gte: currentWeekStart,
    //       $lte: currentWeekEnd,
    //     },
    //   });

    // const previousWeekApplicationsRequests =
    //   await this.applicationModel.countDocuments({
    //     owner: user._id,
    //     createdAt: {
    //       $gte: previousWeekStart,
    //       $lte: previousWeekEnd,
    //     },
    //   });

    // Step 7: Calculate the percentage increase for applications
    // const applicationsPercentageIncrease =
    //   previousWeekApplicationsRequests > 0
    //     ? ((currentWeekApplicationsRequests -
    //         previousWeekApplicationsRequests) /
    //         previousWeekApplicationsRequests) *
    //       100
    //     : currentWeekApplicationsRequests > 0
    //       ? 100
    //       : 0; // If no requests last week but some this week, consider it a 100% increase

    const defaultStats = {
      available: 0,
      occupied: 0,
      pending: 0,
      draft: 0,
    };

    const propertiesStats = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyOverview.find(
        (item) => item.month === i + 1,
      ) || { month: i + 1 };
      return Object.assign({}, defaultStats, monthData);
    });

    const totalDraft = propertiesStats.reduce(
      (acc, item) => acc + item.draft,
      0,
    );
    const totalAvailable = propertiesStats.reduce(
      (acc, item) => acc + item.available,
      0,
    );
    const totalOccupied = propertiesStats.reduce(
      (acc, item) => acc + item.occupied,
      0,
    );
    return transformToDto(PropertyStatsResponseDto, {
      stats: propertiesStats,
      totalDraft,
      totalAvailable,
      totalOccupied,
    });
  }
}
