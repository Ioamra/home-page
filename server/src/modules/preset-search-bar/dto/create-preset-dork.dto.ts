import { IsString } from 'class-validator';

export class CreatePresetDorkDto {
  @IsString()
  label: string;

  @IsString()
  entry: string;
}
