import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class RecoverTfaDto {
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token is required' })
  @Transform(({ value }) => value?.trim())
  recoveryToken: string;
}
