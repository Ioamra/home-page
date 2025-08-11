import { IsString } from 'class-validator';

export class CreateDorkDto {
  @IsString()
  label: string;

  @IsString()
  entry: string;
}
