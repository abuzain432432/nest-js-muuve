import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { TourStatusEnum } from 'src/modules/tour/enums/tour-status.enum';

export class CreateTourDto {
  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  message: string;

  @IsString()
  @IsNotEmpty({ message: 'Owner is required' })
  owner: string;

  @IsString()
  @IsNotEmpty({ message: 'Property is required' })
  property: string;

  @IsEnum(TourStatusEnum)
  @IsNotEmpty({ message: 'Status type is required' })
  status: TourStatusEnum;

  @IsString()
  @IsNotEmpty({ message: 'Tour date is required' })
  tourDate: string;
}
