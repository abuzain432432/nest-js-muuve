import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { PropertyStatusEnum } from './enums/property-status.enum';
import { IUser } from 'src/common/types/user.type';

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

    const currentDate = new Date();
    const currentWeekStart = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay()),
    );
    const currentWeekEnd = new Date(
      currentDate.setDate(currentWeekStart.getDate() + 6),
    );

    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const previousWeekEnd = new Date(currentWeekEnd);
    previousWeekEnd.setDate(previousWeekEnd.getDate() - 7);

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
          pending: {
            $sum: {
              $cond: [
                { $eq: ['$_id.status', PropertyStatusEnum.DRAFT] },
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

    // const totalToursRequests = await this.tourModel.aggregate([
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

    // const totalToursRequestsCount = totalToursRequests[0]?.total || 0;

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

    // const totalApplicationsRequestsCount =
    //   totalApplicationsRequests[0]?.total || 0;

    // const currentWeekToursRequests = await this.tourModel.countDocuments({
    //   owner: user._id,
    //   createdAt: {
    //     $gte: currentWeekStart,
    //     $lte: currentWeekEnd,
    //   },
    // });

    // const previousWeekToursRequests = await this.tourModel.countDocuments({
    //   owner: user._id,
    //   createdAt: {
    //     $gte: previousWeekStart,
    //     $lte: previousWeekEnd,
    //   },
    // });

    // const toursPercentageIncrease =
    //   previousWeekToursRequests > 0
    //     ? ((currentWeekToursRequests - previousWeekToursRequests) /
    //         previousWeekToursRequests) *
    //       100
    //     : currentWeekToursRequests > 0
    //       ? 100
    //       : 0; // If no requests last week but some this week, consider it a 100% increase

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

    // Step 8: Prepare the properties stats array
    const propertiesStats = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyOverview.find(
        (item) => item.month === i + 1,
      ) || {
        month: i + 1,
        available: 0,
        occupied: 0,
        pending: 0,
        draft: 0,
      };
      return monthData;
    });

    // Step 9: Construct the final response
    return {
      // totalApplicationsRequests: totalApplicationsRequestsCount,
      // totalToursRequests: totalToursRequestsCount,
      // toursPercentageIncrease, // Include percentage increase for tours in the response
      // applicationsPercentageIncrease, // Include percentage increase for applications in the response
      propertiesStats,
    };
  }
}
