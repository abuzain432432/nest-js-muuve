import { IsString, IsNotEmpty, IsUrl, IsMongoId } from 'class-validator';

export class CreateListingFeeCheckoutDto {
  @IsMongoId({ message: 'Invalid propertyId' })
  @IsNotEmpty({ message: 'propertyId is required' })
  propertyId: string;

  @IsUrl(
    { require_protocol: false },
    { message: 'cancelUrl must be a valid URL' },
  )
  @IsNotEmpty({ message: 'cancelUrl is required' })
  cancelUrl: string;

  @IsUrl(
    { require_protocol: false },
    { message: 'successUrl must be a valid URL' },
  )
  @IsNotEmpty({ message: 'successUrl is required' })
  successUrl: string;
}
