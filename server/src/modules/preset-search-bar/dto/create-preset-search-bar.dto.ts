import { IsArray, IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';
import { CreatePresetDorkDto } from './create-preset-dork.dto';
import { CreatePresetQueryParamDto } from './create-preset-query-param.dto';

export class CreatePresetSearchBarDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsBoolean()
  is_search_query_param?: boolean;

  @IsOptional()
  @IsString()
  query_param_key?: string;

  @IsOptional()
  @IsArray()
  dorks?: CreatePresetDorkDto[];

  @IsOptional()
  @IsArray()
  query_params?: CreatePresetQueryParamDto[];
}
