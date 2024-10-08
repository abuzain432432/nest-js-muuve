import { Expose } from 'class-transformer';
import { IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class Stats {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  month: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  available: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  occupied: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  pending: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  draft: number;
}

export class PropertyStatsResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Stats)
  @IsNotEmpty()
  @Expose()
  stats: Stats[];

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  totalDraft: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  totalAvailable: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  totalOccupied: number;
}
