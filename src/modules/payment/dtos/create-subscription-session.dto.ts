import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateSubscriptionSessionDto {
  @IsUrl({ require_protocol: false })
  @IsNotEmpty({ message: 'cancelUrl is required' })
  cancelUrl: string;

  @IsUrl({ require_protocol: false })
  @IsNotEmpty({ message: 'successUrl is required' })
  successUrl: string;

  @IsString()
  @IsNotEmpty({ message: 'priceId is required' })
  priceId: string;
}
