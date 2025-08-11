import { IsString } from 'class-validator';

export class CreateQueryParamDto {
  @IsString()
  label: string;

  @IsString()
  entry: string;
}
