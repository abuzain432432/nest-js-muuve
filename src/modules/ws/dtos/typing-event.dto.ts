import { IsString, IsNotEmpty } from "class-validator";

export class TypingEventDto {
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;
}
