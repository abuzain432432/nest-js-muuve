import { Expose } from 'class-transformer';
import { Property } from 'src/modules/property/schemas/property.schema';
export class UserResponseDto {
  @Expose()
  readonly _id: string;
  @Expose()
  readonly firstName: string;
  @Expose()
  readonly lastName: string;
  @Expose()
  readonly email: string;
  @Expose()
  readonly role: string;
  @Expose()
  readonly provider: string;
  @Expose()
  readonly tfa: boolean;
  @Expose()
  readonly properties: Property[];
  @Expose()
  readonly active: boolean;
}
