import { Injectable } from '@nestjs/common';
import { PropertyService } from '../property/property.service';
import { IUser } from 'src/common/types/user.type';
import { TourService } from '../tour/tour.service';
import { StatsResponseDto } from './dtos/stats-response.dto';
import { transformToDto } from 'src/common/lib/transform-to-dto.lib';

@Injectable()
export class StatsService {
  constructor(
    private propertyService: PropertyService,
    private tourService: TourService,
  ) {}
  async getStatsByYear(user: IUser, year: number) {
    const propertyStats = await this.propertyService.gePropertiesStats(
      user,
      year,
    );
    const tourStats = await this.tourService.geToursStats(user, year);
    return transformToDto(StatsResponseDto, {
      properties: propertyStats,
      tours: tourStats,
    });
  }
}
