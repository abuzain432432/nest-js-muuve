import { PropertyStatsResponseDto } from 'src/modules/property/dtos/property-stats-response.dto';
import { TourStatsResponseDto } from 'src/modules/tour/dtos/tour-stats-response.dto';
import { ValidateNested } from 'class-validator';
import { Type, Expose } from 'class-transformer';

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
