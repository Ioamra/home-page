import { IsString } from 'class-validator';

export class CreatePresetQueryParamDto {
  @IsString()
  label: string;

  @IsString()
  entry: string;
}
