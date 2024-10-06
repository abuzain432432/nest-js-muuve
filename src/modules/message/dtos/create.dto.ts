import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsObject,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsOptional()
  parentIdMessage?: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsOptional()
  file?: string;

  @IsString()
  @IsNotEmpty()
  meta: string;

  @IsBoolean()
  @IsOptional()
  edited?: boolean;

  @IsObject()
  @IsOptional()
  reaction?: Record<string, any>;
}
