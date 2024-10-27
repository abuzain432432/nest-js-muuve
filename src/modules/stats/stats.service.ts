import { Injectable } from "@nestjs/common";

import { transformToDto } from "src/common/lib/transform-to-dto.lib";
import { IUser } from "src/common/types/user.type";

import { PropertyService } from "../property/property.service";
import { TourService } from "../tour/tour.service";

import { StatsResponseDto } from "./dtos/stats-response.dto";

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
