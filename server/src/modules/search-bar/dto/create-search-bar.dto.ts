import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateDorkDto } from './create-dork.dto';
import { CreateQueryParamDto } from './create-query-param.dto';

export class CreateSearchBarDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsArray()
  dorks?: CreateDorkDto[];

  @IsOptional()
  @IsArray()
  query_params?: CreateQueryParamDto[];
}
