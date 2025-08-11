import { IsOptional, IsString } from 'class-validator';

export class CreatePresetBackgroundDto {
  @IsOptional()
  @IsString()
  image?: string;
}
