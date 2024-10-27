import { Type, Expose } from "class-transformer";
import { ValidateNested } from "class-validator";
import { PropertyStatsResponseDto } from "src/modules/property/dtos/property-stats-response.dto";
import { TourStatsResponseDto } from "src/modules/tour/dtos/tour-stats-response.dto";

export class StatsResponseDto {
  @ValidateNested()
  @Expose()
  @Type(() => PropertyStatsResponseDto)
  properties: PropertyStatsResponseDto;

  @ValidateNested()
  @Expose()
  @Type(() => TourStatsResponseDto)
  tours: TourStatsResponseDto;
}
