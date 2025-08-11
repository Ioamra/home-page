import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePresetLinkDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsUrl()
  url: string;
}
