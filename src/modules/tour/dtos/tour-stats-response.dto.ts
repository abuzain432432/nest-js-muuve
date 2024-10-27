import { Type, Expose } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested, IsNotEmpty } from 'class-validator';

export class TourStatsResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Stats)
  @Expose()
  @IsNotEmpty()
  stats: Stats[];

  @IsNumber()
  @Expose()
  @IsNotEmpty()
  increasePercentage: number;
}

class Stats {
  @IsNumber()
  @Expose()
  @IsNotEmpty()
  month: number;

  @IsNumber()
  @Expose()
  @IsNotEmpty()
  accepted: number;

  @IsNumber()
  @Expose()
  @IsNotEmpty()
  rejected: number;

  @IsNumber()
  @Expose()
  @IsNotEmpty()
  pending: number;
}
