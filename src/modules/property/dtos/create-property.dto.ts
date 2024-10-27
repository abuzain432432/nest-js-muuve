import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsObject,
  IsDateString,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { PropertyTypeEnum } from 'src/modules/property/enums/property-type-enum';

class ScheduleTimeDto {
  @IsDateString()
  from: Date;

  @IsDateString()
  to: Date;
}

class SchedulePeriodDto {
  @IsDateString()
  from: Date;

  @IsDateString()
  to: Date;
}

class LeasePeriodDto {
  @IsDateString()
  from: Date;

  @IsDateString()
  to: Date;
}

class LocationDto {
  @IsArray()
  @ArrayMinSize(2, {
    message: 'Coordinates array must contain exactly two values',
  })
  @ArrayMaxSize(2, {
    message: 'Coordinates array must contain exactly two values',
  })
  @IsNumber(
    {},
    {
      each: true,

      message: 'Invalid value for coordinates. Coordinates must be a number',
    },
  )
  coordinates: [number, number];
}

class ShapeDto {
  @IsString()
  @IsNotEmpty()
  type: 'Polygon';

  @IsArray()
  @IsArray({ each: true })
  @IsNumber({}, { each: true })
  coordinates: number[][][];
}
class ShapesDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ShapeDto)
  cShape: ShapeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ShapeDto)
  pShape: ShapeDto;
}

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true, message: 'Facilities is required' })
  facilities: string[];

  @IsObject({ message: 'ScheduleTime is required' })
  @ValidateNested()
  @Type(() => ScheduleTimeDto)
  scheduleTime: ScheduleTimeDto;

  @IsObject({ message: 'SchedulePeriod is required' })
  @ValidateNested()
  @Type(() => SchedulePeriodDto)
  schedulePeriod: SchedulePeriodDto;

  @IsObject({ message: 'LeasePeriod is required' })
  @ValidateNested()
  @Type(() => LeasePeriodDto)
  leasePeriod: LeasePeriodDto;

  @IsObject({ message: 'Location is required' })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsObject({ message: 'Shapes is required' })
  @ValidateNested()
  @Type(() => ShapesDto)
  @IsOptional()
  shapes?: ShapesDto;

  @IsString()
  @IsOptional()
  buildingName?: string;

  @IsNumber({}, { message: 'Invalid value for price. Price must be a number' })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsNumber(
    {},
    { message: 'Invalid value for deposit. Deposit must be a number' },
  )
  @IsNotEmpty({ message: 'Bathrooms is required' })
  bathrooms: number;

  @IsNumber(
    {},
    { message: 'Invalid value for bedrooms. Bedrooms must be a number' },
  )
  @IsNotEmpty({ message: 'Bedrooms is required' })
  bedrooms: number;

  @IsNumber({}, { message: 'Invalid value for area. Area must be a number' })
  @IsNotEmpty({ message: 'Area is required' })
  area: number;

  @IsBoolean({
    message: 'Invalid value for petsAllowed. PetsAllowed must be a boolean',
  })
  @IsOptional()
  catsAllowed: boolean;

  @IsNumber(
    {},
    { message: 'Invalid value for catsLimit. CatsLimit must be a number' },
  )
  @IsOptional()
  catsLimit: number;

  @IsBoolean({
    message: 'Invalid value for dogsAllowed. DogsAllowed must be a boolean',
  })
  @IsOptional()
  dogsAllowed: boolean;

  @IsNumber(
    {},
    { message: 'Invalid value for dogsLimit. DogsLimit must be a number' },
  )
  @IsOptional()
  dogsLimit: number;

  @IsString({ message: 'Pets comment must be a string' })
  @IsOptional()
  petsComment?: string;

  @IsBoolean({
    message: 'Invalid value for carPort. CarPort must be a boolean',
  })
  @IsOptional()
  carPort?: boolean;

  @IsEnum(PropertyTypeEnum)
  @IsNotEmpty({ message: 'Property type is required' })
  type: PropertyTypeEnum;
}
